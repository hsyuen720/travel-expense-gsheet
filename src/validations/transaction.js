import * as yup from "yup";
import validate from "../utils/validate.js";

export const addTransaction = validate(
  yup.object().shape({
    spreadsheetId: yup.string().required(),
    data: yup.object().shape({
      category: yup.string().required(),
      description: yup.string().required(),
      localAmount: yup.number().nullable(),
      amount: yup.number().nullable(),
      paidBy: yup.string().required(),
      involvedPeople: yup.array().of(yup.string().required()).nullable(),
    }),
  }),
);
