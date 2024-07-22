import { googleSheets } from "../utils/google.js";
import { setSummarySheet } from "../core/settings/summary.js";
import { setExpensesSheet } from "../core/settings/expenses.js";
import { SHEETS } from "../settings/constants.js";

export const setupSheets = async (req, res) => {
  try {
    const { spreadsheetId, people } = req.body;
    const sheetResponse = await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: Object.values(SHEETS).map((title) => ({
          addSheet: { properties: { title } },
        })),
      },
    });

    const sheetIds = sheetResponse.data.replies.reduce((result, value) => {
      const properties = value.addSheet.properties;
      switch (properties.title) {
        case SHEETS.EXPENSES:
          result[SHEETS.EXPENSES] = properties.sheetId;
          break;
        case SHEETS.SUMMARY:
          result[SHEETS.SUMMARY] = properties.sheetId;
          break;
        default:
          break;
      }
      return result;
    }, {});

    await googleSheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: [...setExpensesSheet(people), ...setSummarySheet(people)],
        valueInputOption: "USER_ENTERED",
      },
    });

    res
      .status(201)
      .json({ message: "Sheets generated successfully", sheetIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
