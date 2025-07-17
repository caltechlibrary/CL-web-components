// deno:https://jsr.io/@std/csv/1.0.6/_shared.ts
function codePointLength(s) {
  return Array.from(s).length;
}

// deno:https://jsr.io/@std/csv/1.0.6/_io.ts
function createBareQuoteErrorMessage(zeroBasedRecordStartLine, zeroBasedLine, zeroBasedColumn) {
  return `Syntax error on line ${zeroBasedRecordStartLine + 1}; parse error on line ${zeroBasedLine + 1}, column ${zeroBasedColumn + 1}: bare " in non-quoted-field`;
}
function createQuoteErrorMessage(zeroBasedRecordStartLine, zeroBasedLine, zeroBasedColumn) {
  return `Syntax error on line ${zeroBasedRecordStartLine + 1}; parse error on line ${zeroBasedLine + 1}, column ${zeroBasedColumn + 1}: extraneous or missing " in quoted-field`;
}
function convertRowToObject(row, headers, zeroBasedLine) {
  if (row.length !== headers.length) {
    throw new Error(`Syntax error on line ${zeroBasedLine + 1}: The record has ${row.length} fields, but the header has ${headers.length} fields`);
  }
  const out = {};
  for (const [index, header] of headers.entries()) {
    out[header] = row[index];
  }
  return out;
}

// deno:https://jsr.io/@std/csv/1.0.6/parse.ts
var BYTE_ORDER_MARK = "\uFEFF";
var Parser = class {
  #input = "";
  #cursor = 0;
  #options;
  constructor({ separator = ",", trimLeadingSpace = false, comment, lazyQuotes, fieldsPerRecord } = {}) {
    this.#options = {
      separator,
      trimLeadingSpace,
      comment,
      lazyQuotes,
      fieldsPerRecord
    };
  }
  #readLine() {
    if (this.#isEOF()) return null;
    let buffer = "";
    let hadNewline = false;
    while (this.#cursor < this.#input.length) {
      if (this.#input.startsWith("\r\n", this.#cursor)) {
        hadNewline = true;
        this.#cursor += 2;
        break;
      }
      if (this.#input.startsWith("\n", this.#cursor)) {
        hadNewline = true;
        this.#cursor += 1;
        break;
      }
      buffer += this.#input[this.#cursor];
      this.#cursor += 1;
    }
    if (!hadNewline && buffer.endsWith("\r")) {
      buffer = buffer.slice(0, -1);
    }
    return buffer;
  }
  #isEOF() {
    return this.#cursor >= this.#input.length;
  }
  #parseRecord(zeroBasedStartLine) {
    let fullLine = this.#readLine();
    if (fullLine === null) return null;
    if (fullLine.length === 0) {
      return [];
    }
    let zeroBasedLine = zeroBasedStartLine;
    if (this.#options.comment && fullLine[0] === this.#options.comment) {
      return [];
    }
    let line = fullLine;
    const quote = '"';
    const quoteLen = quote.length;
    const separatorLen = this.#options.separator.length;
    let recordBuffer = "";
    const fieldIndexes = [];
    parseField: while (true) {
      if (this.#options.trimLeadingSpace) {
        line = line.trimStart();
      }
      if (line.length === 0 || !line.startsWith(quote)) {
        const i = line.indexOf(this.#options.separator);
        let field = line;
        if (i >= 0) {
          field = field.substring(0, i);
        }
        if (!this.#options.lazyQuotes) {
          const j = field.indexOf(quote);
          if (j >= 0) {
            const col = codePointLength(fullLine.slice(0, fullLine.length - line.slice(j).length));
            throw new SyntaxError(createBareQuoteErrorMessage(zeroBasedStartLine, zeroBasedLine, col));
          }
        }
        recordBuffer += field;
        fieldIndexes.push(recordBuffer.length);
        if (i >= 0) {
          line = line.substring(i + separatorLen);
          continue parseField;
        }
        break parseField;
      } else {
        line = line.substring(quoteLen);
        while (true) {
          const i = line.indexOf(quote);
          if (i >= 0) {
            recordBuffer += line.substring(0, i);
            line = line.substring(i + quoteLen);
            if (line.startsWith(quote)) {
              recordBuffer += quote;
              line = line.substring(quoteLen);
            } else if (line.startsWith(this.#options.separator)) {
              line = line.substring(separatorLen);
              fieldIndexes.push(recordBuffer.length);
              continue parseField;
            } else if (0 === line.length) {
              fieldIndexes.push(recordBuffer.length);
              break parseField;
            } else if (this.#options.lazyQuotes) {
              recordBuffer += quote;
            } else {
              const col = codePointLength(fullLine.slice(0, fullLine.length - line.length - quoteLen));
              throw new SyntaxError(createQuoteErrorMessage(zeroBasedStartLine, zeroBasedLine, col));
            }
          } else if (line.length > 0 || !this.#isEOF()) {
            recordBuffer += line;
            const r = this.#readLine();
            line = r ?? "";
            fullLine = line;
            if (r === null) {
              if (!this.#options.lazyQuotes) {
                const col = codePointLength(fullLine);
                throw new SyntaxError(createQuoteErrorMessage(zeroBasedStartLine, zeroBasedLine, col));
              }
              fieldIndexes.push(recordBuffer.length);
              break parseField;
            }
            zeroBasedLine++;
            recordBuffer += "\n";
          } else {
            if (!this.#options.lazyQuotes) {
              const col = codePointLength(fullLine);
              throw new SyntaxError(createQuoteErrorMessage(zeroBasedStartLine, zeroBasedLine, col));
            }
            fieldIndexes.push(recordBuffer.length);
            break parseField;
          }
        }
      }
    }
    const result = [];
    let preIdx = 0;
    for (const i of fieldIndexes) {
      result.push(recordBuffer.slice(preIdx, i));
      preIdx = i;
    }
    return result;
  }
  parse(input) {
    this.#input = input.startsWith(BYTE_ORDER_MARK) ? input.slice(1) : input;
    this.#cursor = 0;
    const result = [];
    let lineResult;
    let first = true;
    let lineIndex = 0;
    const INVALID_RUNE = [
      "\r",
      "\n",
      '"'
    ];
    const options = this.#options;
    if (INVALID_RUNE.includes(options.separator) || typeof options.comment === "string" && INVALID_RUNE.includes(options.comment) || options.separator === options.comment) {
      throw new Error("Cannot parse input: invalid delimiter");
    }
    let _nbFields;
    if (options.fieldsPerRecord === void 0 || options.fieldsPerRecord < 0) {
      _nbFields = "ANY";
    } else if (options.fieldsPerRecord === 0) {
      _nbFields = "UNINITIALIZED";
    } else {
      _nbFields = options.fieldsPerRecord;
    }
    while (true) {
      const r = this.#parseRecord(lineIndex);
      if (r === null) break;
      lineResult = r;
      lineIndex++;
      if (first) {
        first = false;
        if (_nbFields === "UNINITIALIZED") {
          _nbFields = lineResult.length;
        }
      }
      if (lineResult.length > 0) {
        if (typeof _nbFields === "number" && _nbFields !== lineResult.length) {
          throw new SyntaxError(`Syntax error on line ${lineIndex}: expected ${_nbFields} fields but got ${lineResult.length}`);
        }
        result.push(lineResult);
      }
    }
    return result;
  }
};
function parse(input, options = {
  skipFirstRow: false
}) {
  const parser = new Parser(options);
  const r = parser.parse(input);
  if (options.skipFirstRow || options.columns) {
    let headers = [];
    if (options.skipFirstRow) {
      const head = r.shift();
      if (head === void 0) {
        throw new TypeError("Cannot parse input: headers must be defined");
      }
      headers = head;
    }
    if (options.columns) {
      headers = options.columns;
    }
    const zeroBasedFirstLineIndex = options.skipFirstRow ? 1 : 0;
    return r.map((row, i) => {
      return convertRowToObject(row, headers, zeroBasedFirstLineIndex + i);
    });
  }
  return r;
}

// deno:https://jsr.io/@std/streams/1.0.10/_common.ts
var DEFAULT_BUFFER_SIZE = 32 * 1024;
function createLPS(pat) {
  const length = pat.length;
  const lps = new Uint8Array(length);
  lps[0] = 0;
  let prefixEnd = 0;
  let i = 1;
  while (i < length) {
    if (pat[i] === pat[prefixEnd]) {
      prefixEnd++;
      lps[i] = prefixEnd;
      i++;
    } else if (prefixEnd === 0) {
      lps[i] = 0;
      i++;
    } else {
      prefixEnd = lps[prefixEnd - 1];
    }
  }
  return lps;
}

// deno:https://jsr.io/@std/streams/1.0.10/text_delimiter_stream.ts
var TextDelimiterStream = class extends TransformStream {
  #buf = "";
  #delimiter;
  #inspectIndex = 0;
  #matchIndex = 0;
  #delimLPS;
  #disp;
  /**
   * Constructs a new instance.
   *
   * @param delimiter A delimiter to split the stream by.
   * @param options Options for the stream.
   */
  constructor(delimiter, options) {
    super({
      transform: (chunk, controller) => {
        this.#handle(chunk, controller);
      },
      flush: (controller) => {
        controller.enqueue(this.#buf);
      }
    });
    this.#delimiter = delimiter;
    this.#delimLPS = createLPS(new TextEncoder().encode(delimiter));
    this.#disp = options?.disposition ?? "discard";
  }
  #handle(chunk, controller) {
    this.#buf += chunk;
    let localIndex = 0;
    while (this.#inspectIndex < this.#buf.length) {
      if (chunk[localIndex] === this.#delimiter[this.#matchIndex]) {
        this.#inspectIndex++;
        localIndex++;
        this.#matchIndex++;
        if (this.#matchIndex === this.#delimiter.length) {
          const start = this.#inspectIndex - this.#delimiter.length;
          const end = this.#disp === "suffix" ? this.#inspectIndex : start;
          const copy = this.#buf.slice(0, end);
          controller.enqueue(copy);
          const shift = this.#disp === "prefix" ? start : this.#inspectIndex;
          this.#buf = this.#buf.slice(shift);
          this.#inspectIndex = this.#disp === "prefix" ? this.#delimiter.length : 0;
          this.#matchIndex = 0;
        }
      } else {
        if (this.#matchIndex === 0) {
          this.#inspectIndex++;
          localIndex++;
        } else {
          this.#matchIndex = this.#delimLPS[this.#matchIndex - 1];
        }
      }
    }
  }
};

// deno:https://jsr.io/@std/csv/1.0.6/stringify.ts
var QUOTE = '"';
var LF = "\n";
var CRLF = "\r\n";
var BYTE_ORDER_MARK2 = "\uFEFF";
function getEscapedString(value, sep) {
  if (value === void 0 || value === null) return "";
  let str = "";
  if (typeof value === "object") str = JSON.stringify(value);
  else str = String(value);
  if (str.includes(sep) || str.includes(LF) || str.includes(QUOTE)) {
    return `${QUOTE}${str.replaceAll(QUOTE, `${QUOTE}${QUOTE}`)}${QUOTE}`;
  }
  return str;
}
function normalizeColumn(column) {
  let header;
  let prop;
  if (typeof column === "object") {
    if (Array.isArray(column)) {
      header = String(column[column.length - 1]);
      prop = column;
    } else {
      prop = Array.isArray(column.prop) ? column.prop : [
        column.prop
      ];
      header = typeof column.header === "string" ? column.header : String(prop[prop.length - 1]);
    }
  } else {
    header = String(column);
    prop = [
      column
    ];
  }
  return {
    header,
    prop
  };
}
function getValuesFromItem(item, normalizedColumns) {
  const values = [];
  if (normalizedColumns.length) {
    for (const column of normalizedColumns) {
      let value = item;
      for (const prop of column.prop) {
        if (typeof value !== "object" || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          if (typeof prop === "number") value = value[prop];
          else {
            throw new TypeError('Property accessor is not of type "number"');
          }
        } else value = value[prop];
      }
      values.push(value);
    }
  } else {
    if (Array.isArray(item)) {
      values.push(...item);
    } else if (typeof item === "object") {
      throw new TypeError("No property accessor function was provided for object");
    } else {
      values.push(item);
    }
  }
  return values;
}
function stringify(data, options) {
  const { headers = true, separator: sep = ",", columns = [], bom = false } = options ?? {};
  if (sep.includes(QUOTE) || sep.includes(CRLF)) {
    const message = [
      "Separator cannot include the following strings:",
      '  - U+0022: Quotation mark (")',
      "  - U+000D U+000A: Carriage Return + Line Feed (\\r\\n)"
    ].join("\n");
    throw new TypeError(message);
  }
  const normalizedColumns = columns.map(normalizeColumn);
  let output = "";
  if (bom) {
    output += BYTE_ORDER_MARK2;
  }
  if (headers && normalizedColumns.length > 0) {
    output += normalizedColumns.map((column) => getEscapedString(column.header, sep)).join(sep);
    output += CRLF;
  }
  for (const item of data) {
    const values = getValuesFromItem(item, normalizedColumns);
    output += values.map((value) => getEscapedString(value, sep)).join(sep);
    output += CRLF;
  }
  return output;
}

// deno:https://jsr.io/@std/csv/1.0.6/stringify_stream.ts
var CsvStringifyStream = class extends TransformStream {
  /**
   * Construct a new instance.
   *
   * @param options Options for the stream.
   */
  constructor(options) {
    const { separator, columns = [] } = options ?? {};
    super({
      start(controller) {
        if (columns && columns.length > 0) {
          try {
            controller.enqueue(stringify([
              columns
            ], separator !== void 0 ? {
              separator,
              headers: false
            } : {
              headers: false
            }));
          } catch (error) {
            controller.error(error);
          }
        }
      },
      transform(chunk, controller) {
        try {
          controller.enqueue(stringify([
            chunk
          ], separator !== void 0 ? {
            separator,
            headers: false,
            columns
          } : {
            headers: false,
            columns
          }));
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
};

// src/textarea-csv.js
var TextareaCSV = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isComponentInitialized = false;
    this.custcomCleanupFilter = void 0;
  }
  static get observedAttributes() {
    return ["column-headings", "id", "class", "caption", "text", "placeholder", "css-href", "debug"];
  }
  attributeChangedCallback(name) {
    if (name === "column-headings" && this.isComponentInitialized) {
      this.initializeTable();
    }
  }
  connectedCallback() {
    this.initializeComponent();
    this.isComponentInitialized = true;
    this.initializeTable();
    this.setupEventListeners();
    this.setupMutationObserver();
  }
  setupMutationObserver() {
    const targetNode = this.shadowRoot.querySelector("tbody");
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["value"]
      // This ensures we only observe changes to the 'value' attribute
    };
    const callback = (mutationsList, _observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "value") {
          this.toTextarea();
        } else if (mutation.type === "childList") {
          this.toTextarea();
        }
      }
    };
    this.observer = new MutationObserver(callback);
    if (targetNode) {
      this.observer.observe(targetNode, config);
    }
  }
  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  initializeComponent() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        input { width: 100%; }
      </style>
      <table>
        <thead></thead>
        <tbody></tbody>
      </table>
      <button id="append-row">Append Row</button>
      <button id="cleanup">Cleanup</button>
      ${this.hasAttribute("debug") ? '<button id="debug">Debug</button>' : ""}
      ${this.hasAttribute("title") || this.hasAttribute("help-description") ? '<span id="help-icon">\u24D8</span>' : ""}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    if (this.hasAttribute("css-href")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this.getAttribute("css-href");
      this.shadowRoot.appendChild(link);
    }
    if (this.hasAttribute("title") || this.hasAttribute("help-description")) {
      const helpIcon = this.shadowRoot.getElementById("help-icon");
      helpIcon.addEventListener("click", () => {
        alert(`${this.getAttribute("title") || ""}
${this.getAttribute("help-description") || ""}`);
      });
    }
  }
  initializeTable() {
    const headings = parseCSVRow(this.getAttribute("column-headings"));
    const table = this.shadowRoot.querySelector("table");
    const thead = table.querySelector("thead");
    thead.innerHTML = "";
    const tr = document.createElement("tr");
    headings.forEach((heading) => {
      const th = document.createElement("th");
      th.textContent = heading;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    const textarea = this.querySelector("textarea");
    if (textarea && textarea.value.trim()) {
      this.fromTextarea();
    } else {
      this.appendRow();
    }
    const datalists = this.querySelectorAll("datalist");
    datalists.forEach((datalist) => {
      this.shadowRoot.appendChild(datalist.cloneNode(true));
    });
    headings.forEach((heading, index) => {
      const datalist = this.shadowRoot.querySelector(`datalist#${heading.toLowerCase()}`);
      if (datalist) {
        this.setAutocomplete(index, Array.from(datalist.options).map((option) => ({ value: option.value })));
      }
    });
  }
  setupEventListeners() {
    this.shadowRoot.querySelector("#append-row").addEventListener("click", () => this.appendRow());
    this.shadowRoot.querySelector("#cleanup").addEventListener("click", () => this.cleanupTable());
    if (this.hasAttribute("debug")) {
      this.shadowRoot.querySelector("#debug").addEventListener("click", () => {
        console.log(this.toCSV());
      });
    }
    this.shadowRoot.querySelector("tbody").addEventListener("input", (event) => {
      if (event.target.tagName === "INPUT") {
        const rowIndex = event.target.closest("tr").rowIndex - 1;
        const colIndex = event.target.closest("td").cellIndex;
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent("changed", { detail: { rowIndex, colIndex, value } }));
        if (this.hasAttribute("debug")) {
          console.log(`Cell changed: Row ${rowIndex}, Col ${colIndex}, Value ${value}`);
        }
      }
    });
    this.shadowRoot.querySelector("tbody").addEventListener("focus", (event) => {
      if (event.target.tagName === "INPUT") {
        const rowIndex = event.target.closest("tr").rowIndex - 1;
        const colIndex = event.target.closest("td").cellIndex;
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent("focused", { detail: { rowIndex, colIndex, value } }));
        if (this.hasAttribute("debug")) {
          console.log(`Cell focused: Row ${rowIndex}, Col ${colIndex}, Value ${value}`);
        }
      }
    }, true);
    this.shadowRoot.querySelector("tbody").addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && event.target.tagName === "INPUT") {
        const input = event.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start === end && start > 0) {
          input.value = input.value.slice(0, start - 1) + input.value.slice(end);
          input.selectionStart = input.selectionEnd = start - 1;
          event.preventDefault();
        }
      }
    });
  }
  rowCount() {
    return this.shadowRoot.querySelector("tbody").rows.length;
  }
  columnCount() {
    return this.shadowRoot.querySelector("thead").rows[0].cells.length;
  }
  isEmptyRow(rowIndex) {
    const row = this.shadowRoot.querySelector(`tbody tr:nth-child(${rowIndex + 1})`);
    return Array.from(row.cells).every((cell) => cell.querySelector("input").value === "");
  }
  appendRow() {
    const tbody = this.shadowRoot.querySelector("tbody");
    const row = document.createElement("tr");
    for (let i = 0; i < this.columnCount(); i++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = this.getAttribute("placeholder") || "";
      const datalistId = `column-${i}`;
      const datalist = this.shadowRoot.querySelector(`datalist#${datalistId}`);
      if (datalist) {
        input.setAttribute("list", datalistId);
      }
      td.appendChild(input);
      row.appendChild(td);
    }
    tbody.appendChild(row);
    row.cells[0].querySelector("input").focus();
  }
  cleanupTable() {
    const tbody = this.shadowRoot.querySelector("tbody");
    const rows = tbody.rows;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (this.isEmptyRow(i)) {
        tbody.deleteRow(i);
      }
      if (this.customCleanupFilter !== void 0 && this.customCleanupFilter(rows[i]) === false) {
        tbody.deleteRow(i);
      }
    }
  }
  toCSV() {
    const rows = [];
    const tbody = this.shadowRoot.querySelector("tbody").rows;
    console.log(this.innertHTML);
    for (let i = 0; i < tbody.length; i++) {
      const cells = tbody[i].cells;
      const row = [];
      for (let j = 0; j < cells.length; j++) {
        row.push(cells[j].querySelector("input").value);
      }
      rows.push(row);
    }
    return stringifyCSV(rows);
  }
  fromCSV(csvText) {
    const rows = parse(csvText);
    const tbody = this.shadowRoot.querySelector("tbody");
    tbody.innerHTML = "";
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell;
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  toObjects() {
    const objects = [];
    const tbody = this.shadowRoot.querySelector("tbody").rows;
    for (let i = 0; i < tbody.length; i++) {
      const cells = tbody[i].cells;
      for (let j = 0; j < cells.length; j++) {
        objects.push({ rowIndex: i, colIndex: j, value: cells[j].querySelector("input").value });
      }
    }
    return objects;
  }
  fromObjects(objects) {
    const tbody = this.shadowRoot.querySelector("tbody");
    tbody.innerHTML = "";
    objects.forEach((obj) => {
      let row = tbody.rows[obj.rowIndex];
      if (!row) {
        row = document.createElement("tr");
        tbody.appendChild(row);
      }
      let cell = row.cells[obj.colIndex];
      if (!cell) {
        cell = document.createElement("td");
        row.appendChild(cell);
      }
      let input = cell.querySelector("input");
      if (!input) {
        input = document.createElement("input");
        input.type = "text";
        cell.appendChild(input);
      }
      input.value = obj.value;
    });
  }
  fromTextarea() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      this.fromCSV(textarea.value.trim());
    }
  }
  toTextarea() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      textarea.value = this.toCSV();
      console.log("Textarea updated with CSV data:", textarea.value);
    }
  }
  setupFormListener() {
    const form = this.closest("form");
    if (form) {
      form.addEventListener("submit", (_event) => {
        this.toTextarea();
      });
    }
  }
  getCellValue(rowIndex, colIndexOrName) {
    const colIndex = typeof colIndexOrName === "number" ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const cell = this.shadowRoot.querySelector(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1}) input`);
    return cell ? cell.value : "";
  }
  setCellValue(rowIndex, colIndexOrName, value) {
    const colIndex = typeof colIndexOrName === "number" ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const cell = this.shadowRoot.querySelector(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1}) input`);
    if (cell) {
      cell.value = value;
    }
  }
  toJSON() {
    return JSON.stringify(this.toObjects());
  }
  fromJSON(jsonString) {
    this.fromObjects(JSON.parse(jsonString));
  }
  setAutocomplete(colIndexOrName, options) {
    const colIndex = typeof colIndexOrName === "number" ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const datalistId = `column-${colIndex}`;
    let datalist = this.shadowRoot.querySelector(`datalist#${datalistId}`);
    if (!datalist) {
      datalist = document.createElement("datalist");
      datalist.id = datalistId;
      this.shadowRoot.appendChild(datalist);
    }
    datalist.innerHTML = "";
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      datalist.appendChild(opt);
    });
    const inputs = this.shadowRoot.querySelectorAll(`tbody td:nth-child(${colIndex + 1}) input`);
    inputs.forEach((input) => input.setAttribute("list", datalistId));
  }
  getAutocomplete(colIndexOrName) {
    const colIndex = typeof colIndexOrName === "number" ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const datalist = this.shadowRoot.querySelector(`datalist#column-${colIndex}`);
    if (datalist) {
      const options = [];
      datalist.querySelectorAll("option").forEach((option) => {
        options.push({ value: option.value });
      });
      return options;
    }
    return void 0;
  }
  getColumnIndexByName(colName) {
    const headings = parseCSVRow(this.getAttribute("column-headings"));
    return headings.indexOf(colName);
  }
};
function parseCSVRow(csvRowString) {
  const data = parse(csvRowString);
  return data[0];
}
function stringifyCSVRow(row) {
  return stringify([row]);
}
function stringifyCSV(data) {
  return stringify(data);
}
customElements.define("textarea-csv", TextareaCSV);
export {
  TextareaCSV,
  parseCSVRow,
  stringifyCSV,
  stringifyCSVRow
};
