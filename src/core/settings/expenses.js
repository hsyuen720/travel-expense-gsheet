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
  getTargetCell,
  getTargetRange,
} from "../sheets.js";

export const setExpensesSheet = (people = []) => {
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
      values: Array.from({ length: 100 }, (_, i) => {
        const allCell = getTargetCell(
          EXPENSES_START_CELLS.PEOPLE_TO_PAY,
          0,
          i + 1,
        );

        const allPeopleRange = getEntireRowRange(
          SHEETS.SUMMARY,
          SUMMARY_START_CELLS.PEOPLE,
        );
        const currentAmountCell = getTargetCell(
          getCellByHeader(
            EXPENSES_START_CELLS.DATA,
            EXPENSES_HEADINGS,
            EXPENSES_HEADINGS.AMOUNT,
          ),
          0,
          i,
        );
        const currentPeopleRange = getEntireRowRange(
          SHEETS.EXPENSES,
          getTargetCell(EXPENSES_START_CELLS.PEOPLE_TO_PAY, 1, i + 1),
        );

        return [
          `=IF(${currentAmountCell} > 0, IF(${allCell}, COUNTA(${allPeopleRange}), COUNTIF(${currentPeopleRange}, TRUE)), "")`,
        ];
      }),
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

    const condition = `ISNUMBER(${dividedByRange})`;
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
      values: [[`=ARRAYFORMULA(IF(${condition}, ${value}, ""))`]],
    };
  };

  const setPeopleToPayData = () => {
    const startCell = getTargetCell(EXPENSES_START_CELLS.PEOPLE_TO_PAY, 0, 1);
    return {
      range: getTargetRange(SHEETS.EXPENSES, startCell, people.length, 100),
      values: Array.from({ length: 100 }).map((_, i) => {
        const currentPayeeRange = getEntireRowRange(
          SHEETS.EXPENSES,
          getTargetCell(startCell, 1, i),
        );
        return [
          `=COUNTIF(${currentPayeeRange}, TRUE) <= 0`,
          ...people.map((_) => "FALSE"),
        ];
      }),
    };
  };

  return [
    // Header
    setSummaryData(),
    setHeadingData(),
    setPeopleToPayHeading(),
    // Data
    setDividedByData(),
    setAmountPerPersonData(),
    setPeopleToPayData(),
  ];
};

export const setExpensesSheetFormat = () => {
  return [];
};

export const setExpensesSheetValidation = () => {};
