CSVTextarea implements a web component `csv-textarea`. The CSVTextarea manage tabular data. `csv-textarea` element wraps an HTML textarea element. The innerHTML of the textarea will contain CSV content. It is implemented as an ES6 module. The module will be in a file named "csvtextarea.js".

The web component displays the CSV content as an HTML5 table. The table is editable except for the header row.
The header row's cells can be specified in the `csv-testarea` attribute called "column-headings". The "column-headings" attribute value is a CSV row indicating the column headings. If a heading contains a comma the heading is quoted. "column-headings" is a required attribute.

The column count will match the number number of headings found in "column-headings". 

The minimum number or rows displayed is one. The minimum number of columns is one.  Columns and rows can be set with "cols" and "rows" attribute. "max-rows" holds the maximum number of rows the table can hold.

When a cell is changed and looses focus an event will be trigger indicating the new value of the cell as well as the row number, column number and column heading.  The cell's value should be updated in the CSV content heald in the inner textarea's innerHTML.


Example HTML of a minimal `csv-textarea`.

```
<csv-textarea column-headings="column_1,column_2,column_3">
    <textarea>
        one,two,three
        monday,tuesday,wednesday
    </textarea>
</csv-textarea>
```

--

When the CSVTextarea element is loaded it should populate the table based on the CSV content inside the textarea that the CSVTextarea wraps.

When CSVTextarea is submitted it should submit the contents of the inner textarea element.

Rendering the table should not trigger a submissionm event. 

The innerHTML of `csv-textarea` is a a textarea. That textarea contains the CSV content that is needed to display in the table.

--

When a cell both changes and looses focus it should trigger a change event that includes details of the new value of the cell, the row number of the cell, the column number of the cell and the heading of the cell.

--

The `csv-textarea` has an optional "caption" attribute. If the value of the "caption" is not an empty string it will cause the table to have a caption showing the value.

--

When the `csv-textarea` is contained in a form the web-components should be one submitted element in the form data with the CSV content submitted. It should not replace the other form data element.

The CSV content submitted should only include the CSV content in the element that is instanciated.

--

Add two actions to CSVTextarea web component. First is insertRow which will insert an empty for at the end of the table. The focus should then be set to the first cell in the new row.

The second is cleanupCSV. The will remove any rows that have all empty cells in the CSV content.

A button below the table labeled "Insert Row" tha triggers the insertRow action. Another button labeled "Cleanup" will trigger the cleanupCSV.

When `submitCSVContent` should use the cleanupCSV action before replacing the content in the form data for the web component.

--

When adding a new row the first cell of the row should have a column number of 0 not -1.

--

If a cell's value includes one or more commas the whole cell needs to be quoted when the CSV content is updated.

The `parseCSV` method needs to respect quotes when parsing CSV content and when mapping the cell's value in the table.

The following CSV content reflects three columnss of data. The first column in each row contains quoted content.

```csv
"John, of the devine",30,New York
"Jane, of Mary of the fields",25,Los Angeles
```

The a cell is updated from the CSV data it should be unquoted.

--

The parseCSVRow function hangs in the while loop after entering a new cell in the table where the data contains a comma. The regular expression is too slow and bogs the page down.  Rewrite this method to avoid using a regular expression when parsing CSV content.

When adding a quoted call value update the CSV content and display the row to the console.

When the cleanupCSV action happens display the CSV content on the console before the cleanup takes place and after the cleanup takes place.

--

When insert row action is taken it should insert a complete row of empty cells to be added to the table and two the CSV content.

Display the cell's row content before and after the cell is changed.

When a quoted cell is update the it should not reduce the cell count in the row.

`updateCSVContent` should use parseCSVRow before updating the columns value.

When cells to the right of a cell with a comma update the quoting is being lost and the cells to the write get populated the the left cell's comma delimited content. Fix this.

Add an attribute to CSVTextarea called "debug". "debug" should default to false. If "debug" is true and a "cell-change" event occurs then display to the console the before state of the cell, the row and the CSV content, then display the after for the cell, row and CSV content.

When I change a cell that contains a quote it seems to update the CSV content correctly but when I change the next and it does not have a quote the quoted cell becomes multiple cells. Can you fix this?

When "debug" is true also add a "debug" button that will cause the console log to show the current state of the focused cell, the row and the CSV Contents.

A cell's value may contain a quote and for the 'cell-change' event full value of the cell needs to be included. 

--

// Note to self, I'm leaving off here something is still wonky when one more more cells have quotes and other cells that change in a row don't.  When cleanupCSV action is triggered the table cells get messed up and loose the last quoted cells content.
--


When the cleanupCSV action happens quotes cells that were added disappear from the content.

The CSV when executing cleanup the CSV content of 

--

CSV content can contain commas that do not become a new column they cell value is quoted. Thus the following is three columns in CSV format

```"one,two,three",four,"five,six"```

Where the table row would looke like.

```<tr><td>one,two,three</td><td>four</td><td>five,six</td></tr>```

This is not working correctly yet. The CSV content of 

```csv
"John, Delighted",30,New York
"Jane, Mary of the fields",25,Los Angeles
```

Should result in the HTML of 

```
<tr>
    <td contenteditable="true">John, Delighted</td>
    <td contenteditable="true">30</td>
    <td contenteditable="true">New York</td>
</tr>
<tr>
    <td contenteditable="true">Jane, Mary of the fields</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">Los Anglees</td>
</tr>
```

The cleanup actions should respect the quoted CSV content as one cell and not split it across multiple cells.

If a CSV column is empty then the cell should be empty in the table.

--


When the cleanupCSV action is performed it needs to respect the quoted CSV content so that contented that is quoted remains in one cell.

--

The `id`, `class`, `title` and `placeholder` attributes if not set in `csv-textarea` should be derived from the inner textarea's attributes.

The `csv-textarea` will take the CSV content and render it as an editable table.

`csv-textarea` may include a `caption` attribute that will be used in rendering the table representing the CSV content.

When the `csv-textarea` element includes the attribute `css-href` is will replace the CSS in the HTML template of the web component with the contents indicated by the text value of `css-href`. If it is not present the HTML template should include sensible CSS styling for display content using an HTML5 table.

-- 

The web component user interface is implemented as a HTML table using an HTML template.

The web component has a name attribute which is used by web forms to associate the data with the form data. The CSV content in the inner textarea will be what is submitted when the form's submit actions is triggered.

The web component can include an optional column headings attribute. If the column headings attribute is not specified then the column headings then the first row of the CSV content will be used for column headings. Column headings are not editable when the CSV content is displayed.

Making the column headings visible in the web component is set using the "show-headings" attribute. The default is to show the headings. Setting "show-headingss" to false will hide the display of the column headings in the rendered web component.

The number of columns should be configurable using the "cols" attribute.

The number of rows should be configuration using the "rows" attribute.

The minimum number of columns is one.

The minimum number of rows is one.

The default column is two.

The default rows is 1.

The rows and column attributes are required.

The id and class attributes of the `csv-textarea` should be taken from the textarea that is in the innerHTML. This way if JavaScript is disable the CSS will work with the innerHTML textarea as a fallback.

Column headings are shown by default.

The default column headings are "column" followed an underscore an column number.

The column-headings attribute overwrites the default column name.

--

The web component should respond to changes in attributes.

The value is the web component is held in the element's innerHTML's textarea element.

The innerHTML of the textarea holds a comma separated value of the cells visible in the web component.

If header row is included in the innerHTML if it is also displayed

The web component should include a readonly attribute and if true prevent changes to the content

The default status of readonly is false

The web component should be usable in a web form and CSV content should update the web form's data

When a cell web component changes it should trigger a change event updating the CSV content in the body

If all cells in a row are empty then that row should not be included in the CSV content of the body

Each column can have a header row holding a column name configured in the attributes of the web component

The maximum of rows should be optionally configurable

--

If web component cannot be instantiated it should fallback to a plain textarea

The user should be able to add additional rows as needed up to any specified maximum

Adding a row show happen when you press shift enter in the last column of the last row

There should be a single button below the table that will to insert at the bottom of the table on click.

The column headings, rows, columns and button should accepts CSS styling.

Showing the header row is optional, the default is to show it.

The web component needs to support W3C recommendations for accessibility.

The width and size of the component needs to conform to the inheritted styling.

If the body of the web component is populate then it should populate the table.

When the table is change the body of the web component needs to be update.

--

When the web component is part of a web form the component needs to add the CSV content to the form data using the component's name attribute attribute and if non is set then the attribute name of the inner textarea element.

The componment should have a read-only attribute that works like read-only for input attributes. It is false by default.

The default column headings should be the word column, followed by an underscore and the column number

There should only be one insert row button below the table at the bottom of the component.

The column headings should be shown by default.

If the column headings attribute is not set in the `csv-textarea` element then the first from the CSV content should be used as the column headings.

Use an HTML template to structure the component.

The HTML template should include the header row.

--

When a row is added the focus should  go to the first cell of the added row.

If a cell contains a comma then the value of the cell needs to be quoted in the CSV output.

The web component needs to add the contents when the web form is encoded and sent to the web service.

The change event trigger for a cell should only happen when the cell looses focus.

The change event trigger should include details for column and row of cell that changed.

Add a toJSON function. Represent each row as an object in an array of objects. The attribute names for the objects should match the column headings but be lower case with spaces replaced by underscore and other non-alphanumeric characters removed.

Add a fromJSON function that will take a list of objects and map the attributes into columns for each row in the sheet.

--

CSVTextarea needs to include cell column and row number in the change event.

The change event detail should include include column name, column number and row number in the change event.

There also needs to be a function to update a cell in the table given a column, row and value

The update cell function should allow the column name or column number in the column parameter

Add a function to retrieve a cell's value from the table given a column name or number, and a row number.

--

The web component should support the following keyboard findings:

`Ctrl+Shift+Spacebar` or `Ctrl+A`
: Select the all cells in the table table.

`Shift+Arrow key`
: Extend the selection of cells the adjacent cell indicated by the arrow key.

`Ctrl+Shift+Right Arrow key`
: Extend the selection of cells to end of the row.

`Ctrl+Shift+Left Arrow key`
: Extend the selection of cells to beginning of the row.

`Ctrl+Shift+Up Arrow key`
: Extend the selection of cells up one row towards the top of the table.

`Ctrl+Shift+Down Arrow key`
: Extend the selection of cells down one row towards the bottom of table

`Ctrl+Spacebar`
: Select an entire column of cells in the table.

`Shift+Spacebar`
: Select an entire row of cells in the table.

`Ctrl+C`
: Copy selected cells to the clipboard as CSV text.

`Ctrl+V`
: Pasts the CSV content in the clipboard into the cells agents to the current cell focus.

`Shift+Page down`
: Select all cells from the current location to the last cell of the column.

`Shift+Page up`
: Select all cells from the current location to the first cell of the column.

`Shift+End`
: Select all cells from the current location to the last cell of the row.

`Shift+Home`
: Select all cells from the current location to the first cell of the row.

`Ctrl+Home`
: Move to the first cell in the upper-left corner of selected table.

`Ctrl+End`
: Move to the last cell in the lower-right corner of selected table.

`Ctrl+Left arrow key`
: Move to the first cell of the selected row.

`Ctrl+Right arrow key`
: Move to the last cell of the selected row.

`Ctrl+Up arrow key`
: Move to the first cell of the selected column.

`Ctrl+Down arrow key`
: Move to the last cell of selected column.

`Ctrl+Backspace`
: Delete the contents of a cell

`Ctrl+Shift+I`
: Should trigger the insert row action.

The mouse should support selecting content within a cell as well as selecting multiple cells.

--

The column headings should become the attribute names for objects described in toJSON function. The attribute names should be formed by lower casing the column heading, replacing spaces with a single space between alphanumeric characters in the heading and non-alphanumeric characters should be removed from the attribute name. Example "Group Name" would become "group_name" and "Monday, Wednesday, Friday" would become "monday_wednesday_friday".

A cell is selected and the backspace or delete key are pressed it will set the cell to an empty string.

The colum headings inthe web component must be initialized as an array.

When the `this.columnHeadings` is populated in the web component is must be an array so that the `map` function is available.

The class for `csv-textarea` should be called CSVTextarea.

The HTML page demo_csv0.html with HTML content of ```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSV Textarea</title>
  <script type="module" src="csvtextarea.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const csvTextarea = document.querySelector('csv-textarea');

      // Listen for change events on the csv-textarea
      csvTextarea.addEventListener('change', () => {
        console.log('CSV content changed:', csvTextarea.innerHTML);
      });

      // Listen for form submission
      document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        console.log('Form submitted with CSV content:', csvTextarea.innerHTML);
        // Here you can add code to handle the form submission, e.g., send data to a server
      });
    });
  </script>
</head>
<body>
  <p>This is a minimal test of the csv-textarea component. The column headings should be taken from the first row of CSV content.</p>
  <form>
    <csv-textarea>
      <textarea name="csvData">
        Name,Age,City
        John,30,New York
        Jane,25,Los Angeles  
      </textarea>
    </csv-textarea>
    <p></p>
    <button type="submit">Submit</button>
  </form>
</body>
</html>``` show an editable table with the CSV content from the innerHTML's textarea's innerHTML. The first row of the CSV content will be treated as the column headings since that is not specified in this example use of hte `csv-textarea`. 

This example should show an insert row button and a cleanup button.  The cleanup button will remove empty rows in the table and update the inner textarea's CSV content. The insert button will trigger the insert row event adding an empty row at the bottom of the table.

The insert row action should set the cursor to be in the first cell of inserted row.

When a cell changes in a row the CSV content inside the textarea should be updated.

--

column headings should not be an observable event.

--

There should only be one header row. Adding the heading row should not trigger an event. Before initializing the table header you need to first see if the `csv-textarea` contained a column headings attribute and if not read the first row of CSV content inside the provided textarea as the value of the column headings. The innerHTML textarea of `csv-textarea` will be provided and does not need to be created by the web component.  There should only be one row of buttons below the table created by the web component.

--

Remove the renderFallback function.

--

Do not use recursion to render the the table. This is breaking the web component.

--

The web component should support the following keyboard findings

`Ctrl+Shift+Spacebar` or `Ctrl+A`
: Select all the cells in the entire table contents

`Shift+Arrow key`
: Extend the selection of cells by one cell.

`Ctrl+Shift+Right Arrow key`
: Extend the selection of cells to end of the row

`Ctrl+Shift+Left Arrow key`
: Extend the selection of cells to beginning of the row

`Ctrl+Shift+Up Arrow key`
: Extend the selection of cells to top of table

`Ctrl+Shift+Down Arrow key`
: Extend the selection of cells to bottom of table

`Ctrl+Spacebar`
: Select an entire column in the table

`Shift+Spacebar`
: Select an entire row in the table

`Ctrl+C`
: Copy selected cells to the clipboard as CSV text.

`Ctrl+V`
: Pasts the CSV content in the clipboard into the cells agents to the current cell focus

`Shift+Page down`
: Select all cells from the current location to the last cell of the column.

`Shift+Page up`
: Select all cells from the current location to the first cell of the column.

`Shift+End`
: Select all cells from the current location to the last cell of the row.

`Shift+Home`
: Select all cells from the current location to the first cell of the row.

`Ctrl+Home`
: Move to the first cell in the upper-left corner of selected table.

`Ctrl+End`
: Move to the last cell in the lower-right corner of selected table.

`Ctrl+Left arrow key`
: Move to the first cell of the selected row.

`Ctrl+Right arrow key`
: Move to the last cell of the selected row.

`Ctrl+Up arrow key`
: Move to the first cell of the selected column.

`Ctrl+Down arrow key`
: Move to the last cell of selected column.

`Ctrl+Backspace`
: Delete the contents of a cell

`Ctrl+Insert` or `Ctrl+Shift+I`
: Should insert a row below the current cell

The mouse should support selecting content within a cell as well as selecting multiple cells.

When a cell changes it needs to include the column and row in the event details.

The console is showing that rowIndex is not defined when a cell gets focus.