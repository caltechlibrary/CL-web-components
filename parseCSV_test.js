import { assertEquals } from 'jsr:@std/assert';
import { parseCSV } from './parseCSV.js';


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


