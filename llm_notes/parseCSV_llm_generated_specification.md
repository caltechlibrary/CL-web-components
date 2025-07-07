# Function Specifications

## 1. `parseCSVRow`

- **Purpose**: Parses a single row of CSV data into an array of columns.
- **Input**:
  - `csvRowString` (string): A single row of CSV data as a string.
- **Output**:
  - An array of strings, where each string represents a column in the CSV row.
- **Behavior**:
  - Handles quoted fields, allowing commas within quotes.
  - Trims whitespace from each column.
  - Ignores commas within quoted fields.
- **Example**:
  - Input: `"John,Doe,123"`
  - Output: `["John", "Doe", "123"]`

## 2. `parseCSV`

- **Purpose**: Parses a full CSV string into a 2D array of rows and columns.
- **Input**:
  - `csvString` (string): The entire CSV data as a string.
- **Output**:
  - A 2D array of strings, where each sub-array represents a row of columns.
- **Behavior**:
  - Splits the CSV string into rows based on newline characters.
  - Uses `parseCSVRow` to parse each row.
  - Ensures all rows have the same number of columns by padding with empty strings if necessary.
- **Example**:
  - Input: `"John,Doe\nJane,Smith"`
  - Output: `[["John", "Doe"], ["Jane", "Smith"]]`

## 3. `stringifyCSVRow`

- **Purpose**: Converts an array of strings into a CSV-encoded string.
- **Input**:
  - `array` (array of strings): An array representing a single row of CSV data.
- **Output**:
  - A CSV-encoded string.
- **Behavior**:
  - Encloses fields containing commas, newlines, or double quotes in double quotes.
  - Escapes double quotes within fields by doubling them.
- **Example**:
  - Input: `["John", "Doe", "123"]`
  - Output: `"John,Doe,123"`

## 4. `stringifyCSV`

- **Purpose**: Converts a 2D array of strings into a CSV-encoded string.
- **Input**:
  - `data` (2D array of strings): A 2D array representing rows and columns of CSV data.
- **Output**:
  - A CSV-encoded string.
- **Behavior**:
  - Uses `stringifyCSVRow` to convert each row into a CSV-encoded string.
  - Joins the rows with newline characters.
- **Example**:
  - Input: `[["John", "Doe"], ["Jane", "Smith"]]`
  - Output: `"John,Doe\nJane,Smith"`

## General Requirements

- The generated code should maintain the same functionality and behavior as the original JavaScript code.
- The code should handle edge cases, such as empty strings, fields with special characters, and varying numbers of columns per row.
- The code should be written in a clear and maintainable manner, with appropriate comments and documentation.

This specification can be used to guide an LLM in generating functionally equivalent code in another programming language or to rewrite the JavaScript code with the same functionality.