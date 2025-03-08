
# CSVTextarea Web Component 

I would like to implement a web component in JavaScript called CSVTextarea.

The CSVTextarea uses an editable HTML5 table element to manage the tabular data. The CSVTextarea uses an HTML template to structure the table and provide default CSS.

"parseCSV" and "parseCSVRow" are imported from a module called "./parseCSV.js";

The CSVTextarea element has an attribute called "column-headings". This is a required attribute. This is a comma delimited list that use an imported "parseCSVRow" method to produce a list of headings that will be used for the HTML5 table.

The CSVTextarea may of the following attributes, "id", "class", "caption", "text", "placeholder", "css-href".

The CSVTextarea "css-href" attribute is used to fetch custom CSS for the CSVTextarea and replaces the default CSS provided by the HTMLTemplate. 

The CSVTextarea the async initializeComponent should instantiate the HTML template and return a promise if successfully complete.

The CSVTextarea initializeTable method is called after initializeComponent has completed and it should populate the HTML5 table. The HTML5 table heading should be populated from by using the imported "parseCSVRow" method on the "column-headings" attribute. Each string in the array should become a column heading.

The CSVTextarea emits a "cell-change" event consisting of the row index, column index and value for the editable HTML5 table body TD's that change.

The CSVTextarea emits a "cell-focus" event consisting of the row index, column index and value for the editable HTML5 table body TD's recieves focus.

The CSVTextarea has a debug attribute that is false by default. If debug is true the CSVTextarea will use the "toCSV" method to display contents of the HTML5 table's body in the console when CSVTextarea is instantiated in the web page. CSVTextarea should emit events when the HTML5 table body's TD are edited. If debug is true events are displayed in the console.

The CSVTextarea has a method called "rowCount" that returns the number of rows in the HTML5 table body. The minimum number of rows is zero when only the HTML5 table's headings are populated.

The CSVTextarea has a method called "columnCount" that returns the number of columns in the HTML5 table headings. The minimum column count is one. A HTML5 table must have at least one column heading.

The CSVTextarea HTML5 table body must have the same number of columns as the heading columns.

The CSVTextarea has a method called "isEmptyRow". It takes a row index. The method scans each TD of the row and if each TD has an enpty innerHTML then it returns true. If a TD's innerHTML has content true is returned.

The CSVTextarea has a method "appendRow" that adds an row of empty TD at the bottom of the HTML5 table body. Set the input fosuc to the first TD in the added row.

The CSVTextarea has a method "cleanupTable" that looks at each row in the HTML5 table's body and removes it if "isEmptyRow" returns true.

The CSVTextarea has a method "toCSV" method that returns the HTML5 table's body and a CSV text.

The CSVTextarea has a method "fromCSV" that takes CSV text, uses the imported "parseCSV" function and result rows into the HTML5 table body.

The CSVTextarea has a method "toObjects". The method returns a array objects representing each TD in the HTML5 table's body. The objects will have the row index, column index and value of the TDs.

The CSVTextarea has a method "fromObjects". The method takes an array of objects that have the row index, column index and value. It maps the objects into the HTML5 table body replacing or creating TD has needed.

CSVTextarea should have methods the correspond to a HTML5 table's methods. 

CSVTextarea web component must follow W3C accessibilty guidelines.

Multiple CSVTextarea may occur in a web page.

The CSVTextarea will normally be used to wrap a TEXTAREA element. The innerHTML of the TEXTAREA element will provide CSV content used to initial the editable HTML5 table element's body.

The CSVTextarea has a method "fromTextarea" that reads an innerHTML's TEXTAREA, parses the content using "parseCSV" method and updates the HTML5 table body.

The CSVTextarea has a method "toTextarea" that takes the contents of the HTML5 table body and renders it as a CSV setting the innerHTML's of TEXTAREA.

Example usage of the CSVTextarea should look like this.

```html
<csv-textarea id="my-csv" name="csv-table" class="csv-component" title="CSV Editor" placeholder="Enter CSV data" caption="CSV Table" column-headings="Name,Age,City" cols="3" rows="5">
<textarea>
"Doe, Jane", 20, Rancho Cucamonga
"Doe, John", 25, Cocomo
</textarea>
</csv-textarea>
```

When the CSVTextarea is initialized it reads the wrapped TEXTAREA's innerText and has the Table object parse the CSV content and populate the table. There should not be a TEXTAREA rendered by the CSVTextarea web component.

The CSVTextarea has two buttons below the HTML5 table. The first button is labeled "Append Row", it triggers the "appendRow" action. The second button is called "Cleanup" it triggers the "cleanupTable" action. If "debug" is true then those events are shown in the console.

If the CSVTextarea "debug" attribute is true then a third button with a label "Debug". When clicked the the current fucus information and the content CSVTextarea's TEXTAREA's innerHTML will be display the results for toCSV in the console.

Please display the ES6 module, "csv-textarea.js".

When text in a TD is selected and the backspace key is pressed delete the selected text. If not text is selected and the backspace key is pressed delete the character before the cursor.

A TD that contains only space characters, '<br>' and '&nbsp;' is considered empty.

'<br>' and '&nbsp;' should be converted to a single space character in toCSV.

HTML entities in a TD should be converted to their UTF-8 values in the toCSV method.  A '<br>' should be converted to an escaped newline character when invoking toCSV. An '<div>' should be deleted. An '</div>' should become a newline character. '<span>' and `</span>` should be removed.

When CSVTextarea is initialized without and CSV data the HTML5 table body should contain one row of empty TD conforming to the number of headings.
