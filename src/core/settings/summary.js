import {
  getCellByHeader,
  getEntireColumnRange,
  getTargetColumn,
  getRow,
  getTargetRange,
  getTargetCell,
  getEntireRowRange,
} from "../sheets.js";
import {
  SHEETS,
  CATEGORIES,
  EXPENSES_HEADINGS,
  EXPENSES_START_CELLS,
  SUMMARY_START_CELLS,
  STATISTICS,
} from "../../settings/constants.js";

export const setSummarySheet = (people = []) => {
  const setColumnData = () => {
    return [
      {
        range: getEntireColumnRange(
          SHEETS.SUMMARY,
          SUMMARY_START_CELLS.CATEGORIES,
        ),
        values: Object.values(CATEGORIES).map((category) => [category]),
      },
      {
        range: getEntireColumnRange(
          SHEETS.SUMMARY,
          SUMMARY_START_CELLS.STATISTICS,
        ),
        values: Object.values(STATISTICS).map((item) => [item]),
      },
    ];
  };

  const setPeopleData = (people = []) => {
    return {
      range: getEntireRowRange(SHEETS.SUMMARY, SUMMARY_START_CELLS.PEOPLE),
      values: [people],
    };
  };

  const setCategorySumData = (people = []) => {
    return {
      range: getTargetRange(
        SHEETS.SUMMARY,
        SUMMARY_START_CELLS.CATEGORY_DATA,
        people.length,
        Object.values(CATEGORIES).length,
      ),
      values: Object.values(CATEGORIES).map((category) =>
        people.map((_name, index) => {
          const getSumFormula = (isAllDivided = true) => {
            const sumRange = getEntireColumnRange(
              SHEETS.EXPENSES,
              getCellByHeader(
                EXPENSES_START_CELLS.DATA,
                EXPENSES_HEADINGS,
                EXPENSES_HEADINGS.AMOUNT_PER_PERSON,
              ),
              { x: true, y: true },
            );

            const categoryRange = getEntireColumnRange(
              SHEETS.EXPENSES,
              getCellByHeader(
                EXPENSES_START_CELLS.DATA,
                EXPENSES_HEADINGS,
                EXPENSES_HEADINGS.CATEGORY,
              ),
              { x: true, y: true },
            );

            const categoryValue = getCellByHeader(
              SUMMARY_START_CELLS.CATEGORIES,
              CATEGORIES,
              category,
              true,
            );

            const sameCategory = `${categoryRange}, $${categoryValue}`;
            const targetRange = getEntireColumnRange(
              SHEETS.EXPENSES,
              `${getTargetColumn("I", isAllDivided ? 0 : index + 1)}${getRow(
                EXPENSES_START_CELLS.DATA,
              )}`,
              { x: isAllDivided, y: true },
            );

            const condition = `${targetRange}, TRUE`;
            return `SUMIFS(${sumRange}, ${sameCategory}, ${condition})`;
          };
          return `=${getSumFormula(true)} + ${getSumFormula(false)}`;
        }),
      ),
    };
  };

  const setStatisticsSumData = (people = []) => {
    return {
      range: getTargetRange(
        SHEETS.SUMMARY,
        SUMMARY_START_CELLS.STATISTICS_DATA,
        people.length,
        Object.values(STATISTICS).length,
      ),
      values: Object.values(STATISTICS).map((item) =>
        people.map((_name, index) => {
          switch (item) {
            case STATISTICS.TOTAL_EXPENSE:
              const sumRange = getTargetRange(
                SHEETS.SUMMARY,
                getTargetCell(SUMMARY_START_CELLS.CATEGORY_DATA, index, 0),
                0,
                Object.values(CATEGORIES).length - 1,
              );
              return `=SUM(${sumRange})`;
            case STATISTICS.PAID:
              const personCell = getTargetCell(
                SUMMARY_START_CELLS.PEOPLE,
                index,
                0,
              );
              const paidByRange = getEntireColumnRange(
                SHEETS.EXPENSES,
                getCellByHeader(
                  EXPENSES_START_CELLS.DATA,
                  EXPENSES_HEADINGS,
                  EXPENSES_HEADINGS.PAID_BY,
                ),
                { x: true, y: true },
              );
              const paidAmountRange = getEntireColumnRange(
                SHEETS.EXPENSES,
                getCellByHeader(
                  EXPENSES_START_CELLS.DATA,
                  EXPENSES_HEADINGS,
                  EXPENSES_HEADINGS.AMOUNT,
                ),
                { x: true, y: true },
              );
              return `=SUMIF(${paidByRange}, ${personCell}, ${paidAmountRange})`;
            case STATISTICS.OUTSTANDING:
              const startCell = getTargetCell(
                SUMMARY_START_CELLS.CATEGORY_DATA,
                index,
                0,
              );
              const totalExpense = getCellByHeader(
                startCell,
                STATISTICS,
                STATISTICS.TOTAL_EXPENSE,
                true,
              );
              const totalPaid = getCellByHeader(
                startCell,
                STATISTICS,
                STATISTICS.PAID,
                true,
              );
              return `=${totalExpense} - ${totalPaid}`;
            default:
              break;
          }
        }),
      ),
    };
  };

  return [
    ...setColumnData(),
    setPeopleData(people),
    setCategorySumData(people),
    setStatisticsSumData(people),
  ];
};
