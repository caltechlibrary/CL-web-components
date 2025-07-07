# `parseCSV` JavaScript module

> I generated the Javacript Generated with the DuckDuckGo Anthromophic Claude LLM, it did better than Mistral LLM.

This is a JavaScript module with a single exported function called "parseCSV".

This "parseCSV" function returns a two dimensional array of rows and columns. It takes a single string as a parameter. It is intended to accurately process CSV data.

"parseCSV" takes a string containing zero or more lines of text. It treats each line as a row. Each row may contain zero or more columns of data. Each column in the row may contain any valid UTF8 character. When evaluating a row it is scanned for column data. A column starts with the first non space character. A column starts with double quotes then the column will not end until a matching double quote is encountered. Commas are used to eparate the value of each column. Here is an example, this row as three columns `     "Doe, Jane", 20, "Rancho Cucamonga"  ` the first column's value is `Doe, Jane`, the second column value is `20` and the third column value is `Rancho Cucamonga`. When the rows are evaluated the highest column count should be remembered. Whan all rows have been processed make sure they call have the same number of columns, if not add the necessary columns for them to match. The parseCSV function should avoid using regular expressions.

Here is an example of using the "parseCSV" function.

```JavaScript
let data = parseCSV(`one,two,three
"Dean, Joe", 22, "And what?"
    to, "tell, the", something
or other, in , may
`);
(data.length === 4) ? console.log(`${data.length}$ lines read successfuly`) : console.log(`error: ${data.length} lines read, expected 4`);
let i = 0;
for (let row of data) {
    (row.length === 3) ? '' : console.log(`row ${i} is wrong length, ${row}`);
}
```

The "data" variable should be a two dimensional array of rows and columns. 

