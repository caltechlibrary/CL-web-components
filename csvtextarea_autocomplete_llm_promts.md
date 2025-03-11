The CSVTextarea may include one or more HTML datalist elements in the innerHTML.  If a datalist has an id attribute that matches a defined column then that column is an autocomplete column and the cells in the table body for that column should use that datalist for autocomplete suggestions.

Here's is an example of the HTML, ```
  <!-- Define the CSVTextarea component with column headings and autocomplete list -->
  <csv-textarea
    column-headings="name,age,city"
    caption="Personal Information"
    debug="true">

  <!-- Textarea to load CSV data into the table -->
  <textarea placeholder="Paste CSV data here...">
"Doe, Jane", 33, Milwakee
  </textarea>

  <!-- Datalist for city autocomplete -->
  <datalist id="city">
    <option value="New York">
    <option value="Los Angeles">
    <option value="Chicago">
    <option value="Pasadena">
    <option value="Santa Clarita">
  </datalist>

  </csv-textarea>
```

If I replace the value of "Milwakee" and start typing "San" I should see those cities that contain "San" in their names.

--

What doesn't the autocomplete list display?

