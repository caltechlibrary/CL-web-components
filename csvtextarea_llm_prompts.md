
# CSVTextarea Web Component 

I would like to implement a web component in TypeScript called CSVTextarea.

The web component is for working with tabular data. Tabular data is constructed from a two dimensionsal array of cells forming rows and columns.

Each row is index from zero. Each column is index from zero. Each column also has a heading and related HTML5 input type.

A cell is an object defined by its row index, column index, column heading, and HTML5 input type and value. The value of a cell is a string of valid UTF8 characters. A cell's type from their column's HTML5 input type. The default value of a cell's row index is zero, and column index is zero. When a cell is added to a row the column and row indexes are update to match the row and column of the table. The cell type is also updated to match column's type. The default value of the cells value attribute is an empty string.

A cell has a method toCSV which uses JSON stringify result as the comma separated value representation of a cell's value attribute.

A cell has a toJSON method that will render all the cells attributes using JSON stringify.

A cell has a method fromJSON which will parse a JSON object and populate the cell's attributes. If an attribute isn't populated in the JSON expression hen the cell attribute should have a reasonable default. Example cell type should default to string. The cell value should default to and empty string. the default row index is zero, the default column index is zero, the default column heading is an empty string.

A table object contains an ordered collection of cells represented as a two dimensional array of cell objects.

A table has additional attributes of id, name, class_name, number of rows, number of columns, list of columns and HTML5 input types, an optional caption. The number of columns must match the length of the list of column names.

The table has a method for updating individual cells.

The table has a method for receiving a row of cells.

The table has a method of validating the value a cell against the column type.

The table has a method to insert and empty row of cells at the bottom of the table. The inserted cells should have their types set to the type used in their column. The inserted cells should have their row indexes set to the new row number. The column index should be set for the column the cell represents  The column heading should be set for each cell based on the column they are in. The row count for the table should increase by one.

The table has a method to update a row of cells.

The table has a method called cleanUpTable that removes rows made up of cells who's values are empty.

The table has a toCSV method that translates a table's rows into a comma separated value file. The comma separated value format should correctly handle cells that contain commas, double quotes and newlines.

The table has a fromCSV method that translates comma separated values into the cells of the table. like toCSV the fromCSV method needs to handle comma separated values that have cells that contain commas, double quotes abd newlines.

The table has a method toObjects that will translate a table return an ordered array of cells.

The table has a method fromObjects that will read an array of cells and and populate the table.

The CSVTextarea has an innerHTML that wraps an textarea element. The textarea will contain innerText holding comma separated values data.

When the CSVTextarea is initialized the comma separated values are read to populate our table object.

The CSVTextarea will display an editable HTML5 table based on the contents of our table object.

The CSVTextarea will emit a "cell-change" event when a cell is edited. The "cell-change" event should include details of cell row index, column index, column name, column type, and cell value.

The CSVTextarea will emit a "row-change" event. the will list the the cell details for the row when the focus has left the cells in the row.

The "row-change" event will trigger an update of the comma separated value content inside the textarea wrapped by our CSVTextarea component.

The CSVTextarea has a debug attribute that is false by default. If true then console log messages should be emitted when a "cell-change" or "row-change" events.

CSVTextarea should have methods the correspond to the table object's methods. 

---

