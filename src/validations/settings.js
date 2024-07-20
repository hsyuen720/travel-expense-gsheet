import * as yup from "yup";
import validate from "../utils/validate.js";

export const getOptions = validate(
  yup.object().shape({
    spreadsheetId: yup.string().required(),
  }),
);

export const addPeople = validate(
  yup.object().shape({
    spreadsheetId: yup.string().required(),
    people: yup.array().of(yup.string().required()).min(1).required(),
  }),
);
