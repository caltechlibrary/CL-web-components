`csv-textarea` is a web component for working with CSV content.  The innerHTML of the `csv-textarea` should be a textarea who has CSV content as it's innerHTML. Example.

```
<csv-textarea>
<textarea>
one,two,three
monday,tuesday,wednesday
</textarea>
</csv-textarea>
```

Atributes `id`, `class`, `title`, `placeholder` in textarea element will propagate the the `csv-textarea` element.

When the `csv-textarea` element includes the attribute `css-href` is will replace the CSS in the HTML template of the web component with the contents indicated by the text value of `css-href`. If it is not present the HTML template should include sensible CSS styling for display content using an HTML5 table.

`csv-textarea` may include a `caption` attribute that will be used in rendering the table representing the CSV content.
 
The web component will be created in a file called csvtextarea.js and implemented as an ES6 module.

The web component user interface is implemented as a HTML table

The web component has a name attribute which is used by web forms to associate the data with the form data 

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

If web component cannot be instantiated it should fallback to a plain textarea

The user should be able to add additional rows as needed up to any specified maximum

Adding a row show happen when you press shift enter in the last column of the last row

There should be a single button below the table that will to insert a row after the current to the table on click

The column headings, rows, columns and button should accepts CSS styling

Showing the header row is optional, the default is to show it

The web component needs to support W3C recommendations for accessibility

The width and size of the component needs to conform to the inheritted styling

If the body of the web component is populate then it should populate the table

When the table is change the body of the web component needs to be update

When the web component is part of a web form the component needs to add the CSV content to the form data using the component's name attribute

The componment should have a read-only attribute that works like read-only for input attributes

The default column headings should be the word column, followed by an underscore and the column number

There should only be one insert row button in the component

The column headings should be down by default

Use an HTML template to structure the component

The HTML template should include the header row

When a row is added the focus should  go to the first cell of the added row

If a cell contains a comma then the value of the cell needs to be quoted in the CSV output

The web component needs to add the contents when the web form is encoded and sent to the web service.

The change event trigger for a cell should only happen when the cell looses focus

Add a toJSON function. Represent each row as an object with the attribute name matching the column heading and the value matching the cell value.

CSVTextarea needs to include cell column and row number in the change event.

The change event detail should include include column name, column number and row number in the change event.

There also needs to be a function to update a cell in the table given a column, row and value

The update cell function should allow the column name or column number in the column parameter

Add a function to retrieve a cell's value from the table given a column name or number, and a row number

The web component should support the following keyboard findings

`Ctrl+Shift+Spacebar` or `Ctrl+A`
: Select the entire table contents

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

`Ctrl+Insert`
: Should insert a row below the current cell

The mouse should support selecting content within a cell as well as selecting multiple cells.

The column headings should become the attribute names for objects described in toJSON function. The attribute names should be formed by lower casing the column heading, replacing spaces with a single space between alphanumeric characters in the heading and non-alphanumeric characters should be removed from the attribute name. Example "Group Name" would become "group_name" and "Monday, Wednesday, Friday" would become "monday_wednesday_friday".

A cell is selected and the backspace or delete key are pressed it will set the cell to an empty string.
