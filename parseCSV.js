/**
 * Parses a CSV string and returns a 2D array of rows and columns.
 * @param {string} csvString - The CSV data as a string.
 * @returns {string[][]} - A 2D array of rows and columns.
 */
export function parseCSV(csvString) {
  const rows = csvString.trim().split('\n');
  const maxColumns = 0;

  const data = rows.map((row) => {
    let currentColumn = '';
    let inQuotes = false;
    const columns = [];

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(currentColumn.trim());
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }

    columns.push(currentColumn.trim());
    return columns;
  });

  const maxColumnCount = Math.max(...data.map((row) => row.length));

  return data.map((row) => {
    while (row.length < maxColumnCount) {
      row.push('');
    }
    return row;
  });
}

