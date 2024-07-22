/**
 *
 * @param {string} cell
 * @returns {boolean}
 */
const isValidCell = (cell) => {
  return cell.match(/^[A-Z]+[0-9]+$/) !== null;
};

/**
 *
 * @param {string} column
 * @param {string} row
 * @param {{x:boolean, y:boolean}} locked
 * @returns
 */
export const formatCell = (column, row, locked = { x: false, y: false }) => {
  const format = (isLocked, value) => `${isLocked ? "$" : ""}${value}`;
  return `${format(locked.x, column)}${format(locked.y, row)}`;
};

/**
 *
 * @param {string} cell
 * @returns {string}
 */
export const getColumn = (cell) => {
  if (!isValidCell(cell)) {
    throw new Error("Invalid cell");
  }
  return cell.match(/[A-Z]+/)[0];
};

/**
 *
 * @param {string} cell
 * @returns {string}
 */
export const getRow = (cell) => {
  if (!isValidCell(cell)) {
    throw new Error("Invalid cell");
  }
  return cell.match(/[0-9]+/)[0];
};

/**
 * Get the target column.
 * @param {string} column
 * @param {number} offset
 * @returns {string}
 */
export const getTargetColumn = (column, offset) => {
  // TODO: add multiple column support
  return String.fromCharCode(column.charCodeAt() + offset);
};

/**
 * Get the target row.
 * @param {number|string} row
 * @param {number} offset
 * @returns
 */
export const getTargetRow = (row, offset) => {
  return Number(row) + offset;
};

/**
 * Get the target cell.
 * @param {string} cell
 * @param {number} x
 * @param {number} y
 * @returns
 */
export const getTargetCell = (cell, x, y) => {
  const column = getColumn(cell);
  const row = getRow(cell);
  const targetColumn = getTargetColumn(column, x);
  const targetRow = getTargetRow(row, y);
  return `${targetColumn}${targetRow}`;
};

/**
 * Get the target range.
 * @param {string} sheet
 * @param {string} start
 * @param {number} x
 * @param {number} y
 * @param {{x:boolean, y:boolean}} locked
 * @returns {string} ranges
 */
export const getTargetRange = (sheet, start, x, y, locked) => {
  if (!isValidCell(start)) {
    throw new Error("Invalid start position");
  }
  const startColumn = start.match(/[A-Z]+/)[0];
  const startRow = start.match(/[0-9]+/)[0];
  const endColumn = getTargetColumn(startColumn, x);
  const endRow = getTargetRow(startRow, y);
  const from = formatCell(startColumn, startRow, locked);
  const to = formatCell(endColumn, endRow, locked);
  console.log(to);
  return `${sheet}!${from}:${to}`;
};

/**
 * Get the entire column range.
 * @param {string} sheet
 * @param {string} start
 * @param {{x:boolean, y:boolean}} locked
 * @returns
 */
export const getEntireColumnRange = (sheet, start, locked) => {
  if (!isValidCell(start)) {
    throw new Error("Invalid start position");
  }
  const startColumn = start.match(/[A-Z]+/)[0];
  const startRow = start.match(/[0-9]+/)[0];
  const from = formatCell(startColumn, startRow, locked);
  const to = `${locked?.x ? "$" : ""}${startColumn}`;
  return `${sheet}!${from}:${to}`;
};

/**
 * Get the entire row range.
 * @param {string} sheet
 * @param {string} start
 * @param {{x:boolean, y:boolean}} locked
 * @returns
 */
export const getEntireRowRange = (sheet, start, locked) => {
  if (!isValidCell(start)) {
    throw new Error("Invalid start position");
  }
  const startColumn = start.match(/[A-Z]+/)[0];
  const startRow = start.match(/[0-9]+/)[0];
  const from = formatCell(startColumn, startRow, locked);
  const to = `${locked?.x ? "$" : ""}${startRow}`;
  return `${sheet}!${from}:${to}`;
};

/**
 * Get the cell by header.
 * @param {string} start
 * @param {object} header
 * @param {string} value
 * @param {boolean} isVertical
 * @returns
 */
export const getCellByHeader = (start, header, value, isVertical = false) => {
  const column = getColumn(start);
  const row = getRow(start);
  const list = Array.isArray(header) ? header : Object.values(header);
  const offset = list.indexOf(value);

  if (isVertical) {
    const targetRow = getTargetRow(row, offset);
    return `${column}${targetRow}`;
  } else {
    const targetColumn = getTargetColumn(column, offset);
    return `${targetColumn}${row}`;
  }
};
