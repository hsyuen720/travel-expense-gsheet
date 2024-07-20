import camelCase from "lodash.camelcase";
import {
  CATEGORIES,
  EXPENSES_HEADINGS,
  EXPENSES_START_CELLS,
  SHEETS,
  SUMMARY_START_CELLS,
} from "../settings/constants.js";
import { googleSheets } from "../utils/google.js";
import {
  getEntireColumnRange,
  getEntireRowRange,
  getTargetRange,
} from "../core/sheets.js";

export const addTransaction = async (req, res) => {
  try {
    const { spreadsheetId, data } = req.body;

    const response = await googleSheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [
        getEntireRowRange(SHEETS.SUMMARY, SUMMARY_START_CELLS.PEOPLE),
        getTargetRange(
          SHEETS.SUMMARY,
          SUMMARY_START_CELLS.CATEGORIES,
          0,
          Object.values(CATEGORIES).length,
        ),
      ],
    });

    const people = response.data.valueRanges[0].values[0];
    const categories = response.data.valueRanges[1].values.map((row) => row[0]);

    const involvedPeople = data.involvedPeople ?? [];

    if (
      !people.includes(data.paidBy) ||
      !categories.includes(data.category) ||
      involvedPeople.filter((person) => !people.includes(person)).length > 0
    ) {
      res.status(400).json({ message: "Invalid value" });
      return;
    }

    const value = Object.entries(EXPENSES_HEADINGS).reduce(
      (result, [key, value]) => {
        if (
          [
            EXPENSES_HEADINGS.AMOUNT_PER_PERSON,
            EXPENSES_HEADINGS.DIVIDED_BY,
          ].includes(value)
        ) {
          result.push(undefined);
        } else {
          result.push(data[camelCase(key)] ?? "");
        }

        return result;
      },
      [],
    );

    const listOfPayees =
      involvedPeople.length === 0 || involvedPeople.length === people.length
        ? []
        : people.map((person) => involvedPeople.includes(person));

    await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: getEntireColumnRange(SHEETS.EXPENSES, EXPENSES_START_CELLS.DATA),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[...value, undefined, undefined, ...listOfPayees]],
      },
    });

    res.status(201).json({ message: "Transaction added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
