
### CSVTextarea Web Component Specification

#### Overview
The `CSVTextarea` web component is designed to manage and display tabular data in an editable HTML table format. It supports CSV data input and output, autocomplete functionality, and various customization options.

#### Dependencies
- `parseCSV`, `parseCSVRow`, `stringifyCSV`: Functions imported from `./parseCSV.js` for parsing and stringifying CSV data.

#### HTML Structure
- **Shadow DOM**: The component uses Shadow DOM to encapsulate its styles and structure.
- **Template**: The component's template includes a table with a `thead` and `tbody`, and buttons for appending rows and cleaning up the table.

#### Attributes
- **`column-headings`** (required): A comma-delimited list of column headings. This attribute is parsed to create the table headers.
- **`id`**: Sets the ID of the component.
- **`class`**: Sets the class of the component.
- **`caption`**: Sets the caption of the table.
- **`text`**: Sets the text content of the component.
- **`placeholder`**: Sets the placeholder text for input fields in the table.
- **`css-href`**: A URL to custom CSS that replaces the default CSS provided by the HTML template.
- **`debug`**: A boolean attribute that, when true, enables debug logging to the console.

#### Methods

1. **Lifecycle Methods**
   - **`constructor()`**: Initializes the component and attaches a Shadow DOM.
   - **`connectedCallback()`**: Called when the component is added to the DOM. Initializes the component and sets up event listeners.
   - **`attributeChangedCallback(name, old, newVal)`**: Called when an observed attribute is added, removed, or changed.

2. **Initialization Methods**
   - **`initializeComponent()`**: Sets up the component's template and styles. Returns a promise that resolves when the component is fully initialized.
   - **`initializeTable()`**: Initializes the table structure based on the `column-headings` attribute and populates the table body.

3. **Event Handling**
   - **`setupEventListeners()`**: Sets up event listeners for the component's buttons and table cells.

4. **Table Management**
   - **`rowCount()`**: Returns the number of rows in the table body.
   - **`columnCount()`**: Returns the number of columns in the table headings.
   - **`isEmptyRow(rowIndex)`**: Checks if a row is empty.
   - **`appendRow()`**: Adds an empty row to the table body.
   - **`cleanupTable()`**: Removes empty rows from the table body.

5. **Data Conversion**
   - **`toCSV()`**: Converts the table body to a CSV string.
   - **`fromCSV(csvText)`**: Populates the table body from a CSV string.
   - **`toObjects()`**: Converts the table body to an array of objects representing each cell.
   - **`fromObjects(objects)`**: Populates the table body from an array of objects.
   - **`toJSON()`**: Converts the table body to a JSON string.
   - **`fromJSON(jsonString)`**: Populates the table body from a JSON string.

6. **Textarea Integration**
   - **`fromTextarea()`**: Reads CSV data from an inner `<textarea>` and populates the table body.
   - **`toTextarea()`**: Writes the table body's CSV data to an inner `<textarea>`.

7. **Cell Management**
   - **`getCellValue(rowIndex, colIndexOrName)`**: Gets the value of a cell.
   - **`setCellValue(rowIndex, colIndexOrName, value)`**: Sets the value of a cell.

8. **Autocomplete Functionality**
   - **`setAutocomplete(colIndexOrName, options)`**: Associates a datalist with a column's input elements.
   - **`getAutocomplete(colIndexOrName)`**: Returns the options associated with a column's datalist.

9. **Utility Methods**
   - **`getColumnIndexByName(colName)`**: Gets the index of a column by its name.

#### Events
- **`cell-change`**: Emitted when the value of a cell changes. Contains the row index, column index, and new value.
- **`cell-focus`**: Emitted when a cell gains focus. Contains the row index, column index, and value.

#### Accessibility
- The component follows W3C accessibility guidelines by providing keyboard navigation and focus management.
- Includes a clickable help icon (ⓘ) that displays help text if the `title` or `help-description` attributes are present.

#### Customization
- Supports custom CSS via the `css-href` attribute.
- Allows customization of table captions, placeholder text, and debug logging.

#### Usage Example
```html
<csv-textarea id="my-csv" column-headings="Name,Age,City" class="csv-component" title="CSV Editor" placeholder="Enter CSV data" caption="CSV Table" debug>
  <datalist id="city">
    <option value="Azusa">
    <option value="Cocomo">
    <option value="Malibu">
    <option value="Topanga">
    <option value="Rancho Cucamonga">
    <option value="Zuma">
  </datalist>
  <textarea>
    "Doe, Jane", 20, Rancho Cucamonga
    "Doe, John", 25, Cocomo
  </textarea>
</csv-textarea>
```
