import { assertEquals } from 'jsr:@std/assert';
import { parseCSV, parseCSVRow, stringifyCSV  } from './parseCSV.js';


let data = parseCSV(`one,two,three
"Dean, Joe", 22, "And what?"
    to, "tell, the", something
or other, in , may
`);

console.log(data);
// Output:
// [
//   ['one', 'two', 'three'],
//   ['Dean, Joe', '22', 'And what?'],
//   ['to', 'tell, the', 'something'],
//   ['or other', 'in', 'may']
// ]
assertEquals(data.length, 4, `error: ${data.length} lines read, expected 4`);
let i = 0;
for (let row of data) {
  assertEquals(row.length, 3, `row ${i} is wrong length, ${row}`);
  i++;
}

data = parseCSV("Name,Age,City")
assertEquals(data.length, 1, `error: ${data.length} lines read, expected 1`);
console.log(data)


// Stringify usage:
let csvData = [
  ['Field1', 'Field2', 'Field3'],
  ['Value1', 'Value2, with comma', 'Value3 "with quotes"'],
  ['Another1', 'Another2\nwith newline', 'Another3']
];
let csvString = stringifyCSV(csvData);
let expected = `Field1,Field2,Field3
Value1,"Value2, with comma","Value3 ""with quotes"""
Another1,"Another2
with newline",Another3`;
assertEquals(expected, csvString)
console.log(csvString);
csvData = [
  ['Doe, Jane', 23, 'Milwakee'],
  ['Doe, John', 25, 'Cleaveland']
]
csvString = stringifyCSV(csvData);
expected = `"Doe, Jane",23,Milwakee
"Doe, John",25,Cleaveland`;
assertEquals(expected, csvString)
console.log(csvString);

csvData = parseCSV(`"John, 
of the devine
","30
301
202
43
","New York, one
, thee for, --
430
"
"Jane, of Mary of the fields",25,Los Angeles`);
console.log(csvData);

csvString = `"John, \nof the devine\n","30\n301\n202\n43\n","New York, one\n, thee for, --\n430\n"
"Jane, of Mary of the fields",25,Los Angeles`
csvData = parseCSV(csvString);
console.log(csvData);

let csvRow = parseCSVRow("group name, group id");
console.log(csvRow);
assertEquals(csvRow.length, 2);
assertEquals(csvRow[0], "group name");
assertEquals(csvRow[1], "group id");
