
# CSVTextarea Web Component 

I would like to implement a web component in JavaScript called CSVTextarea.

The web component is for working with tabular data. Tabular data is constructed from a two dimensionsal array of cells. The first dimenison is rows, the second is columns with one cell per column.

Each row is index from zero. Each column is index from zero.

A cell is an object defined by its row index, column index and value. The value of a cell is a string of valid UTF8 characters. The default value of a cell's row index is zero, and column index is zero. The default value attribute is an empty string. When a cell is added to a row the column and row indexes are update to match the row and column of the table.

A cell has a method toCSV should use `JSON.stringify` on the cells value element and return that result.

A cell has a toJSON method. This method should collect the attributes into a JavaScript object and use `JSON.stringify` on the resulting object returning that string.

A cell has a method fromJSON which will parse a JSON object and populate the cell's attributes. If an attribute isn't populated in the JSON expression hen the cell attribute should have a reasonable default. Example cell type should default to string. The cell value should default to and empty string. the default row index is zero, the default column index is zero.

A cell has a method called isEmpty. This method returns true of the cell's value is an empty string otherwise it returns false.

A table object contains the following attributes, "columnHeadings", "rowCount", "columnCount" and "data". "columnHeadings" is an array of strings. The length of "columnHeadings" determines the value of "columnCount". "rowCount" and "columnCount" are numeric. "data" is a two dimensional array. The first dimension represents rows. "rows" contain "columns" where each "column" is a cell.  The index value of a row starts with zero. The index value of a column starts with zero. The maximum number of columns is determined by the "columnHeadings" array's length. The table attibute also contains a "currentRow" and "currentColumn" numeric attributes. The number of cells in a row match the number of columns defined for the table. If a row has too few cells then empty cells are added until the column count equals what is defined for the table.

The table has a method called "getCurrentCell" that returns the tables values for "currentRow" and "currentColumn".

The table has a method called "setCurrentCell" that takes the number of an index number for row and an index number of the column to updates the table "currentRow" and "currentColumn" attributes. The index number for row must be greater than or equal to zero and less then the number of length of the "data" attribute. The index number for columns must be greater than or equal to zero and less than the length of the "columnHeadings" array. If either index is out of range "setCurrentCell" returns false, otherwise it returns true.

The table has a method called "updateCell". This updates an individual cell in the tables "data" attribute. The parameters of the update method are rowIndex, colIndex and cell value. rowIndex must be numeric. Rows are index starting from zero. The colIndex maybe a number or string. If it is numeric the colIndex starts at zero. If colIndex is a string then a lookup is used to determine the colIndex numeric value. The string is matched against the column headings defined for the table. Updating a cell causes the "currentRow" and "currentColumn" values to be set using the "setCurrentCell" method. if that method returns false the update is aborted the "updateCell" return false.  The updateCell method returns true if the cell is updated successfully by setting the current cell and updating the cell's value attribute from the cell value attribute provided in the parameters.

The table has a method for retreaving a row of cells. After a row of cells is retrieved the "setCurrentCell" method is used to set the "currentRow" to the row number retrieved and "currentColumn" to the zero.

The table has a method for updating a row of cells. After a row of cells is set the "setCurrentCell" method is used to set the "currentRow" to the row number retrieved and "currentColumn" to the zero.

The table has a method called isEmptyRow. The table isEmptyRow method takes one parameter which is the row number. The row number must zero or greater and less than the number of rows in the "data" array. If the row number is out of range it should throw an error. The method then checks if each cell returns a true value from isEmpty.If a cell's isEmpty returns false the method exits with false. If all cells in the row return true from isEmpty for the row returns true.

The table has a method called isEmpty. It check each rows using isEmptyRow method. The first row that returns false causes the isEmpty method to immediately return false. If all rows isEmptyRow return true then the table's isEmpty returns true.

The table has a method to insert an empty row of cells at the bottom of the table. It fist creates an array of new cells to match the length of the "columnHeadings" array. It then adds that row of cells to the table's "data" array of rows. The row count for the table should increase by one. "setCurrentCell" should be set to the first cell in the new row (column zero).

The table has a method called "cleanUpTable" that removes any row that returns true from calling "isEmptyRow".

The table has a "toCSV" method that translates a table's rows into a comma separated value file. The comma separated value format should correctly handle cells that contain commas, double quotes and newlines.

The table has a fromCSV method that translates comma separated values into the cells of the table. The fromCSV method needs to use the "parseCSV" function for the lines of data it is parsing. The "parseCSV" function is imported into the module from "./parseCSV.js".

The table has a method toObjects that will translate a table return an ordered array of cells.

The table has a method fromObjects that will read an array of cells and and populate the table.

The CSVTextarea has an innerHTML that wraps an textarea element. The textarea will contain innerText holding comma separated values data. The CSVTextarea table object will use it's `fromCSV` method to read the textarea's innerHTML and populate itself.

The CSVTextarea' "column-headings" attribute is required. The value of "column-headings" is parsed using the "parseCSV" function. The parse results are use to set the CSVTextarea's "columnHeadings". 

The CSVTextarea will display an editable HTML5 table based on the contents of our table object. The HTML5 heading rows needs values. Those values are derviced by To get the values to populate the heading row run "parseCSV" on CSVTextarea's "column-headings" attribute and take the heading row of the HTML5 table use "parseCSV" on `column-headings` and taking the first row and mapping the strings to each "td" in the HTML5 headings row. CSVTextarea wraps a textarea element then the textarea's innerHTML content holds our CSV data to populate the HTML5 tables' body. Use "parseCSV" and take the results rows and append them to the HTML5 table body. The heading of the HTML5 table is populated from the strings contained in the "table" attribute's "columnHeadings" attribute. The optional "caption" attribute of the CSVTextarea will populate the HTML5 table's caption element.

To populate the CSVTextarea's HTML5 table's body's "tr" and "td" values use the data from the CSVTextarea's table object.

When CSVTextarea HTML5 table body's "td" element changes a "cell-change" event will be emitted. The "cell-change" event should include details of cell row index, column index, column name, column type, and cell value. The cell change event will invoke the updateCell on the table object.

When CSVTextarea HTML5 table's "td" element recieves focus a "cell-focus" event is trigger. The "cell-focus" event should include details of the td row, column number, column name, and value. If the CSVTextarea's "debug" attribut is true this the event details will be shown on the console. Recieving focus will cause CSVTextarea's table attribute to use "setCurrentCell" to match the focused "td" in the HTML5 table.

The CSVTextarea has a debug attribute that is false by default. When debug is true then the web component is created in a web page the wrapped textarea's innerHTML should be displayed in the console. When the table object belonging to the CSVTextarea use the table's toCSV method to display content in the console. When a `cell-change` event happens after initialization the row of the cell should be displayed in the console using toCSV method. Then a`cell-focus` event happens after initialization the event details should be displayed in the the console.

The CSVTextarea has the following attributes, "id", "name", "class", "title", 
"placeholder", "caption", "column-headings", "cols" and "rows". The number of "cols" is the length of number of headings parsed from "column-headings". The "column-headings" is a required attribute the rest are not.

CSVTextarea should have methods the correspond to the table object's methods. 

CSVTextarea web component must follow W3C accessibilty guidelines.

Multiple CSVTextarea may occur in a web page.

Usage of the CSVTextarea should look like this.

```html
<csv-textarea id="my-csv" name="csv-table" class="csv-component" title="CSV Editor" placeholder="Enter CSV data" caption="CSV Table" column-headings="Name,Age,City" cols="3" rows="5">
<textarea>
"Doe, Jane", 20, Rancho Cucamonga
"Doe, John", 25, Cocomo
</textarea>
</csv-textarea>
```

When the CSVTextarea is initialized it reads the wrapped textarea's innerText and has the Table object parse the CSV content and populate the table. There should not be a textarea rendered by the CSVTextarea web component.

The CSVTextarea has two buttons below the HTML5 table. The first button is labeled "Append Row", it triggers the insertRow action. The second button is called "Cleanup" it triggers the cleanUpTable action.

If the CSVTextarea debug attribute is true then a third button with a label "Debug". When clicked the the current cell information will be displayed along and the CSVTextarea's table attribute will display the results for toCSV in the console.

Please display the ES6 module, "csvtextarea.js", for CSVTextarea, Table class and Cell class.
