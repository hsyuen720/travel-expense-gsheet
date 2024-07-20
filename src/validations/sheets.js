import * as yup from "yup";
import validate from "../utils/validate.js";

export const setupSheets = validate(
  yup.object().shape({
    spreadsheetId: yup.string().required(),
  }),
);
