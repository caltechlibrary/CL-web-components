
I need to created a web component called `sortable-table`. that wraps an HTML `table` element. The web component will allow you to sort the table descending or ascending by clicking the column heads.  The column headings and rows are determined by the table being wrapped by the web component.

Here's an example of using the web component.

```html
<storable-table>
    <table>
        <thead>
            <tr><th>name</th><th>university</th><th>grad year</th></tr>
        </thead>
        <tbody>
            <tr><td>Alice</td><td>Mills College</td><td>1922</td></tr>
            <tr><td>Sr. Mary</td><td>Mount Saint Mary's College</td><td>1919</td></tr>
            <tr><td>Goergina</td><td>Smith College</td><td>1925</td></tr>
        </tbody>
    </table>
</sortable-table>
```

When the `sortable-table` web component instantiates it recreated the innerHTML table representation but makes the table sortable. When you click on a column it sorts the table by that column.  There is also a search column form at the top of the table that will filter the table results by the column select and the text typed in. 

Please generate the JavaScript to created this component.