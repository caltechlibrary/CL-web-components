
# CSVTextarea Web Component 

I would like to implement a web component in JavaScript called CSVTextarea.

The CSVTextarea uses an editable HTML5 table element to manage the tabular data. The CSVTextarea uses an HTML template to structure the table and provide default CSS.

"parseCSV" and "parseCSVRow" are imported from a module called "./parseCSV.js";

The CSVTextarea element has an attribute called "column-headings". This is a required attribute. This is a comma delimited list that use an imported "parseCSVRow" method to produce a list of headings that will be used for the HTML5 table.

The CSVTextarea may of the following attributes, "id", "class", "caption", "text", "placeholder", "css-href".

The CSVTextarea "css-href" attribute is used to fetch custom CSS for the CSVTextarea and replaces the default CSS provided by the HTML Template. 

If the CSVTextarea's innerHTML includes one or more datalist HTML elements those to be cloned into the HTML Template.

The CSVTextarea the async initializeComponent should instantiate the HTML template and return a promise if successfully complete.

The CSVTextarea initializeTable method is called after initializeComponent has completed and it should populate the HTML5 table. The HTML5 table heading should be populated from by using the imported "parseCSVRow" method on the "column-headings" attribute. Each string in the array should become a column heading.

The CSVTextarea's table body's TD elements should use input elements to hold editable content. If there is a datalist associated with the column of the TD then each input element in the column should point to the datalist with it's "list" attribute.

The CSVTextarea emits a "cell-change" event consisting of the row index, column index and value for the editable HTML5 table body TD's input element change.

The CSVTextarea emits a "cell-focus" event consisting of the row index, column index and value for the editable HTML5 table body TD's recieves focus.

The CSVTextarea has a debug attribute that is false by default. If debug is true the CSVTextarea will use the "toCSV" method to display contents of the HTML5 table's body in the console when CSVTextarea is instantiated in the web page. CSVTextarea should emit events when the HTML5 table body's TD are edited. If debug is true events are displayed in the console.

The CSVTextarea has a method called "rowCount" that returns the number of rows in the HTML5 table body. The minimum number of rows is zero when only the HTML5 table's headings are populated.

The CSVTextarea has a method called "columnCount" that returns the number of columns in the HTML5 table headings. The minimum column count is one. A HTML5 table must have at least one column heading.

The CSVTextarea HTML5 table body must have the same number of columns as the heading columns.

The CSVTextarea has a method called "isEmptyRow". It takes a row index. The method scans each TD of the row and if each TD has an enpty innerHTML then it returns true. If a TD's innerHTML has content true is returned.

The CSVTextarea has a method "appendRow" that adds an row of empty TD at the bottom of the HTML5 table body. Set the input fosuc to the first TD in the added row.

The CSVTextarea has a method "cleanupTable" that looks at each row in the HTML5 table's body and removes it if "isEmptyRow" returns true. It should start checking for the empty rows from the bottom and work it's way to the top.

The CSVTextarea has a method "toCSV" method that returns the HTML5 table's body and a CSV text. The toCSV method should use "stringifyCSV"  imported from "./parseCSV.js" to encode the rows array in CSV format.

The CSVTextarea has a method "fromCSV" that takes CSV text, uses the imported "parseCSV" function and result rows into the HTML5 table body.

The CSVTextarea has a method "toObjects". The method returns a array objects representing each TD in the HTML5 table's body. The objects will have the row index, column index and value of the TDs.

The CSVTextarea has a method "fromObjects". The method takes an array of objects that have the row index, column index and value. It maps the objects into the HTML5 table body replacing or creating TD has needed.

When the CSVTextarea's inner TEXTAREA's innerText is an empty string then display the HTML5 table with a single empty row with the same number of cells as the number of column headings.

CSVTextarea should have methods the correspond to a HTML5 table's methods. 

CSVTextarea web component must follow W3C accessibilty guidelines.

Multiple CSVTextarea may occur in a web page.

The CSVTextarea will normally be used to wrap a TEXTAREA element. The innerHTML of the TEXTAREA element will provide CSV content used to initial the editable HTML5 table element's body.

The CSVTextarea has a method "fromTextarea" that reads an innerHTML's TEXTAREA, parses the content using "parseCSV" method and updates the HTML5 table body.

The CSVTextarea has a method "toTextarea" that takes the contents of the HTML5 table body and uses "stringifyCSV" when setting the innerHTML's of TEXTAREA.

Example usage of the CSVTextarea should look like this.

```html
<csv-textarea id="my-csv" name="csv-table" class="csv-component" title="CSV Editor" placeholder="Enter CSV data" caption="CSV Table" column-headings="Name,Age,City" cols="3" rows="5">
<datalist id="city">
<option value="Azuza">
<option value="Cocomo">
<option value="Malibu">
<option vlaue="Topanga">
<option value="Rancho Cucamonga">
<option vlaue="Zuma">
</datalist>
<textarea>
"Doe, Jane", 20, Rancho Cucamonga
"Doe, John", 25, Cocomo
</textarea>
</csv-textarea>
```

When the CSVTextarea is initialized it reads the wrapped TEXTAREA's innerText and has the Table object parse the CSV content and populate the table. There should not be a TEXTAREA rendered by the CSVTextarea web component.

The CSVTextarea has two buttons below the HTML5 table. The first button is labeled "Append Row", it triggers the "appendRow" action. The second button is called "Cleanup" it triggers the "cleanupTable" action. If "debug" is true then those events are shown in the console.

If the CSVTextarea "debug" attribute is true then a third button with a label "Debug". When clicked the the current fucus information and the content CSVTextarea's TEXTAREA's innerHTML will be display the results for toCSV in the console.

Please display the ES6 module, "csvtextarea.js".

When text in a TD is selected and the backspace key is pressed delete the selected text. If not text is selected and the backspace key is pressed delete the character before the cursor.

When CSVTextarea is initialized without any CSV data the HTML5 table the header and use the appendRow method to add an empty row to the HTML5 table's body.

CSVTextarea should include "getCellValue" method that take a row index and column index or name. It should return the value of the corresponding input element contained in the TD of the table's body corresponding row and index. If column index is not a number the column index value is dereved by matching the string against a column-heading.

CSVTextarea should include a "setCellValue" method that takes a row index, column index or name, and a value. It sets the value of the input element contained in the TD corresponding the the row and column index. If column index is not a number the column index value is dereved by matching the string against a column-heading.

CSVTextarea should include a method `toJSON` that uses `toObjects` and returns the results by using `JSON.stringify`.

CSVTextarea should include a method `fromJSON` that takes a JSON string and used `JSON.parse` and `fromObjects` to update the CSVTextarea table.

CSVTextarea should include a method called `setAutocomplete` that will associated a datalist in the HTML Template with a column's input elements. The `setAutocomplate` takes a column index or name and an array of objects where each object's value is used when creating the datalist's options.

CSVTextarea should include a method called `getAutocomplete`. This method takes a column index or name.  It returns an array of objects representing the options associated with the column's datalist. If no datalist is found it returns undefined.

If the CSVTextarea as a title attribute, "help-description" attribute a 
clickable "ⓘ" should be included after the buttons. Clicking toggles the a help message. The help message is composed from the CSVTextarea's title if available, the value in a "help-text" attribute if available and should describe navigating and editing the table.

