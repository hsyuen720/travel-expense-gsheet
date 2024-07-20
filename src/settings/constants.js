import { getTargetCell, getTargetRow } from "../core/sheets.js";

export const SHEETS = {
  EXPENSES: "Expenses",
  SUMMARY: "Summary",
};

export const CATEGORIES = {
  ACCOMMODATION: "Accommodation",
  TRANSPORT: "Transport",
  FOOD: "Food",
  ADMISSION_FEE: "Admission Fee",
  SHOPPING: "Shopping",
  OTHER: "Other",
};

export const STATISTICS = {
  TOTAL_EXPENSE: "Total Expense",
  PAID: "Paid",
  OUTSTANDING: "Outstanding",
};

export const SUMMARY_START_CELLS = {
  CATEGORIES: "A2",
  PEOPLE: "B1",
  STATISTICS: `A${getTargetRow(2, Object.values(CATEGORIES).length + 1)}`,
  CATEGORY_DATA: "B2",
  STATISTICS_DATA: `B${getTargetRow(2, Object.values(CATEGORIES).length) + 1}`,
};

export const EXPENSES_HEADINGS = {
  CATEGORY: "Category",
  DESCRIPTION: "Description",
  LOCAL_AMOUNT: "Amount (Local)",
  AMOUNT: "Amount (HKD)",
  DIVIDED_BY: "Divided By",
  AMOUNT_PER_PERSON: "Amount/ppl",
  PAID_BY: "Paid By",
};

export const EXPENSES_START_CELLS = {
  HEADINGS: "A2",
  TOTAL_EXPENSE: "A1",
  PEOPLE_TO_PAY: getTargetCell(
    "A2",
    Object.values(EXPENSES_HEADINGS).length + 1,
    0,
  ),
  DATA: "A3",
};
