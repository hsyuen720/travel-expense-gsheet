import {
  CATEGORIES,
  SHEETS,
  SUMMARY_START_CELLS,
} from "../settings/constants.js";
import { setSummarySheet } from "../core/settings/summary.js";
import { getTargetRange, getEntireRowRange } from "../core/sheets.js";
import { googleSheets } from "../utils/google.js";

export const getOptions = async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId;

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

    res.json({
      people,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPeople = async (req, res) => {
  try {
    const { spreadsheetId, people } = req.body;
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: getEntireRowRange(SHEETS.SUMMARY, SUMMARY_START_CELLS.PEOPLE),
    });

    const existingPeopleList = response.data.values[0];
    const newPeopleList = [...new Set([...existingPeopleList, ...people])];

    await googleSheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: setSummarySheet(newPeopleList),
        valueInputOption: "USER_ENTERED",
      },
    });

    res.status(201).json({ message: "People added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
