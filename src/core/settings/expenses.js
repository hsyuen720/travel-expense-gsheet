import {
  EXPENSES_HEADINGS,
  EXPENSES_START_CELLS,
  SHEETS,
  STATISTICS,
  SUMMARY_START_CELLS,
} from "../../settings/constants.js";
import {
  getCellByHeader,
  getEntireColumnRange,
  getEntireRowRange,
} from "../sheets.js";

export const setExpensesSheet = () => {
  const setSummaryData = () => {
    return {
      range: getEntireRowRange(
        SHEETS.EXPENSES,
        EXPENSES_START_CELLS.TOTAL_EXPENSE,
      ),
      values: [
        [
          STATISTICS.TOTAL_EXPENSE,
          `=SUM(${getEntireColumnRange(
            SHEETS.EXPENSES,
            getCellByHeader(
              EXPENSES_START_CELLS.DATA,
              EXPENSES_HEADINGS,
              EXPENSES_HEADINGS.AMOUNT,
            ),
          )})`,
        ],
      ],
    };
  };

  const setHeadingData = () => {
    return {
      range: getEntireRowRange(SHEETS.EXPENSES, EXPENSES_START_CELLS.HEADINGS),
      values: [Object.values(EXPENSES_HEADINGS)],
    };
  };

  const setPeopleToPayHeading = () => {
    return {
      range: getEntireRowRange(
        SHEETS.EXPENSES,
        EXPENSES_START_CELLS.PEOPLE_TO_PAY,
      ),
      values: [
        [
          "All",
          `=ARRAYFORMULA(${getEntireRowRange(
            SHEETS.SUMMARY,
            SUMMARY_START_CELLS.PEOPLE,
          )})`,
        ],
      ],
    };
  };

  const setDividedByData = () => {
    return {
      range: getEntireColumnRange(
        SHEETS.EXPENSES,
        getCellByHeader(
          EXPENSES_START_CELLS.DATA,
          EXPENSES_HEADINGS,
          EXPENSES_HEADINGS.DIVIDED_BY,
        ),
      ),
      // TODO
      // values: [[`=ARRAYFORMULA()`]],
    };
  };

  const setAmountPerPersonData = () => {
    const dividedByRange = getEntireColumnRange(
      SHEETS.EXPENSES,
      getCellByHeader(
        EXPENSES_START_CELLS.DATA,
        EXPENSES_HEADINGS,
        EXPENSES_HEADINGS.DIVIDED_BY,
      ),
    );
    const amountRange = getEntireColumnRange(
      SHEETS.EXPENSES,
      getCellByHeader(
        EXPENSES_START_CELLS.DATA,
        EXPENSES_HEADINGS,
        EXPENSES_HEADINGS.AMOUNT,
      ),
    );

    const condition = `${dividedByRange} = 0`;
    const value = `${amountRange} / ${dividedByRange}`;
    return {
      range: getEntireColumnRange(
        SHEETS.EXPENSES,
        getCellByHeader(
          EXPENSES_START_CELLS.DATA,
          EXPENSES_HEADINGS,
          EXPENSES_HEADINGS.AMOUNT_PER_PERSON,
        ),
      ),
      values: [[`=ARRAYFORMULA(IF(${condition}, "", ${value}))`]],
    };
  };

  const setPeopleToPayData = () => {
    // All true and each person set false
  };

  return [
    // Header
    setSummaryData(),
    setHeadingData(),
    setPeopleToPayHeading(),
    // Data
    setDividedByData(),
    setAmountPerPersonData(),
    // setPeopleToPayData(),
  ];
};

export const setExpensesSheetFormat = () => {
  return [];
};
