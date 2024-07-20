import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: `${process.cwd()}/credentials.json`,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

export const googleSheets = google.sheets({
  version: "v4",
  auth,
});
