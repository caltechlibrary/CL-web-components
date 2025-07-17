// src/version.js
var version = "0.0.12";
var releaseDate = "2025-07-17";
var releaseHash = "9729d57";
var licenseText = `

Copyright (c) 2025, Caltech
All rights not granted herein are expressly reserved by Caltech.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

`;

// src/ul-a-to-z-list.js
var ULAtoZList = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
  }
  connectedCallback() {
    this.render();
    this.setupMutationObserver();
  }
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          this.render();
        }
      });
    });
    observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }
  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        menu {
          list-style-type: none;
          padding: 0;
        }
        menu li {
          display: inline;
          margin-right: 10px;
        }
        .letter-section {
          list-style-type: none;
        }
        .letter-section li {
          text-decoration: none;
          font-weight: none;         
        }
        .back-to-menu {
          display: block;
          margin-top: 20px;
        }
      </style>
      <menu id="menu"></menu>
      <div id="list-container"></div>
      ${this.hasAttribute("long") ? '<a class="back-to-menu" href="#menu">Back to Menu</a>' : ""}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const listContainer = this.shadowRoot.querySelector("#list-container");
    const menu = this.shadowRoot.querySelector("#menu");
    const ulElement = this.querySelector("ul");
    if (!ulElement) return;
    const items = Array.from(ulElement.querySelectorAll("li"));
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const sections = {};
    items.forEach((item) => {
      const firstLetter = item.textContent.trim()[0].toUpperCase();
      if (!sections[firstLetter]) {
        sections[firstLetter] = [];
      }
      sections[firstLetter].push(item);
    });
    alphabet.split("").forEach((letter) => {
      if (sections[letter]) {
        const menuItem = document.createElement("li");
        const menuLink = document.createElement("a");
        menuLink.href = `#section-${letter}`;
        menuLink.textContent = letter;
        menuLink.addEventListener("click", (event) => {
          event.preventDefault();
          const targetSection = this.shadowRoot.querySelector(`#section-${letter}`);
          this.scrollToSection(targetSection);
        });
        menuItem.appendChild(menuLink);
        menu.appendChild(menuItem);
        const section = document.createElement("ul");
        section.classList.add("letter-section");
        section.id = `section-${letter}`;
        const sectionHeading = document.createElement("li");
        const sectionHeadingLink = document.createElement("a");
        sectionHeadingLink.href = `#menu`;
        sectionHeadingLink.textContent = letter;
        sectionHeadingLink.addEventListener("click", (event) => {
          event.preventDefault();
          this.scrollToSection(menu);
        });
        sectionHeading.appendChild(sectionHeadingLink);
        section.appendChild(sectionHeading);
        sections[letter].forEach((item) => {
          const clonedItem = item.cloneNode(true);
          section.appendChild(clonedItem);
        });
        listContainer.appendChild(section);
      }
    });
    const backToMenuLink = this.shadowRoot.querySelector(".back-to-menu");
    if (backToMenuLink) {
      backToMenuLink.addEventListener("click", (event) => {
        event.preventDefault();
        this.scrollToSection(menu);
      });
    }
  }
  scrollToSection(section) {
    const yOffset = -100;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }
};
customElements.define("ul-a-to-z-list", ULAtoZList);

// src/textarea-agent-list.js
var TextareaAgentList = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
  }
  connectedCallback() {
    this.loadStyles();
    this.renderContent();
    this.renderList();
    this.setupMutationObserver();
  }
  loadStyles() {
    const cssHref = this.getAttribute("css-href");
    if (cssHref) {
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", cssHref);
      this.shadowRoot.appendChild(link);
    } else {
      const style = document.createElement("style");
      style.textContent = `
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 8px;
          margin-bottom: 5px;
          background-color: #f4f4f4;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        input {
          width: 100%;
          padding: 8px;
          margin: 4px 0;
          box-sizing: border-box;
        }
        button {
          margin: 4px;
          padding: 8px;
          cursor: pointer;
        }
      `;
      this.shadowRoot.appendChild(style);
    }
  }
  renderContent() {
    const container = document.createElement("div");
    const styleAttribute = this.getAttribute("style");
    if (styleAttribute) {
      container.setAttribute("style", styleAttribute);
    }
    const personOnly = this.hasAttribute("people-only");
    const organizationOnly = this.hasAttribute("organization-only");
    let buttonsHTML = "";
    if (!personOnly) {
      buttonsHTML += `<button id="addOrganization" title="add organization to the list">Add Organization</button>`;
    }
    if (!organizationOnly) {
      buttonsHTML += `<button id="addPerson" title="add person to this list">Add Person</button>`;
    }
    container.innerHTML = `
      <ul id="agentList"></ul>
      ${buttonsHTML}
    `;
    this.shadowRoot.appendChild(container);
    this.agentList = this.shadowRoot.querySelector("#agentList");
    if (!personOnly) {
      const addOrganizationButton = this.shadowRoot.getElementById("addOrganization");
      if (addOrganizationButton) {
        addOrganizationButton.addEventListener("click", () => this.addAgent("organization"));
      }
    }
    if (!organizationOnly) {
      const addPersonButton = this.shadowRoot.getElementById("addPerson");
      if (addPersonButton) {
        addPersonButton.addEventListener("click", () => this.addAgent("person"));
      }
    }
  }
  renderList() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        this.agentList.innerHTML = "";
        const personOnly = this.hasAttribute("person-only");
        const organizationOnly = this.hasAttribute("organization-only");
        parsedContent.forEach((agent, index) => {
          const li = document.createElement("li");
          const styleAttribute = this.getAttribute("style");
          if (styleAttribute) {
            li.setAttribute("style", styleAttribute);
          }
          if (!organizationOnly && (agent.family_name !== void 0 || agent.given_name !== void 0 || agent.orcid !== void 0)) {
            li.innerHTML = `
              <div>
                <input type="text" placeholder="Family Name" title="Family Name" value="${agent.family_name || ""}" data-index="${index}" data-field="family_name" style="${styleAttribute}">
                <input type="text" placeholder="Given Name" title="Given Name" value="${agent.given_name || ""}" data-index="${index}" data-field="given_name" style="${styleAttribute}">
                <input type="text" pattern="^\\d{4}-\\d{4}-\\d{4}-\\d{3}[\\dX]$|^https:\\/\\/orcid\\.org\\/\\d{4}-\\d{4}-\\d{4}-\\d{3}[\\dX]$" placeholder="ORCID" title="ORCID" value="${agent.orcid || ""}" data-index="${index}" data-field="orcid" style="${styleAttribute}">
              </div>
              <button class="removeAgent" title="remove this person from list" data-index="${index}" style="${styleAttribute}">Remove</button>
            `;
          } else if (!personOnly && (agent.name !== void 0 || agent.ror !== void 0)) {
            li.innerHTML = `
              <div>
                <input type="text" placeholder="Organization Name" title="Organization name" value="${agent.name || ""}" data-index="${index}" data-field="name" style="${styleAttribute}">
                <input type="text" pattern="^(?:https:\\/\\/ror\\.org\\/)?0[a-hj-km-np-tv-z0-9]{6}[0-9]{2}$" placeholder="ROR" title="ROR" value="${agent.ror || ""}" data-index="${index}" data-field="ror" style="${styleAttribute}">
              </div>
              <button class="removeAgent" title="remove this organization from list" data-index="${index}" style="${styleAttribute}">Remove</button>
            `;
          }
          this.agentList.appendChild(li);
        });
        this.setupEventListeners();
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }
  setupMutationObserver() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      this.handleJsonChange({
        target: textarea
      });
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            this.handleJsonChange({
              target: textarea
            });
          }
        });
      });
      const config = {
        characterData: true,
        childList: false,
        subtree: true
      };
      observer.observe(textarea, config);
    }
  }
  handleJsonChange(event) {
    if (event.target.value !== "") {
      try {
        const jsonContent = event.target.value;
        const parsedContent = JSON.parse(jsonContent);
        console.log("Parsed JSON:", parsedContent);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }
  setupEventListeners() {
    this.shadowRoot.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", this.handleInputChange.bind(this));
      input.addEventListener("input", this.validateInput.bind(this));
    });
    this.shadowRoot.querySelectorAll(".removeAgent").forEach((button) => {
      button.addEventListener("click", this.handleRemoveAgent.bind(this));
    });
  }
  validateInput(event) {
    const input = event.target;
    const isValid = input.checkValidity();
    if (input.hasAttribute("pattern")) {
      if (isValid) {
        input.style.borderColor = "green";
      } else {
        input.style.borderColor = "red";
      }
    }
  }
  handleInputChange(event) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        const index = event.target.getAttribute("data-index");
        const field = event.target.getAttribute("data-field");
        parsedContent[index][field] = event.target.value;
        textarea.value = JSON.stringify(parsedContent, null, 2);
      } catch (e) {
        console.error("Error updating JSON:", e);
      }
    }
  }
  handleRemoveAgent(event) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const index = event.target.getAttribute("data-index");
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        parsedContent.splice(index, 1);
        textarea.value = JSON.stringify(parsedContent, null, 2);
        this.renderList();
      } catch (e) {
        console.error("Error removing agent:", e);
      }
    }
  }
  addAgent(type) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        const personOnly = this.hasAttribute("people-only");
        const organizationOnly = this.hasAttribute("organization-only");
        if (!organizationOnly && type === "person" || personOnly) {
          parsedContent.push({
            family_name: "",
            given_name: "",
            orcid: ""
          });
        } else if (!personOnly && type === "organization" || organizationOnly) {
          parsedContent.push({
            name: "",
            ror: ""
          });
        }
        textarea.value = JSON.stringify(parsedContent, null, 2);
        this.renderList();
      } catch (e) {
        console.error("Error adding agent:", e);
      }
    }
  }
};
customElements.define("textarea-agent-list", TextareaAgentList);

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
    this.attachShadow({
      mode: "open"
    });
    this.isComponentInitialized = false;
    this.custcomCleanupFilter = void 0;
  }
  static get observedAttributes() {
    return [
      "column-headings",
      "id",
      "class",
      "caption",
      "text",
      "placeholder",
      "css-href",
      "debug"
    ];
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
      attributeFilter: [
        "value"
      ]
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
        this.setAutocomplete(index, Array.from(datalist.options).map((option) => ({
          value: option.value
        })));
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
        this.dispatchEvent(new CustomEvent("changed", {
          detail: {
            rowIndex,
            colIndex,
            value
          }
        }));
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
        this.dispatchEvent(new CustomEvent("focused", {
          detail: {
            rowIndex,
            colIndex,
            value
          }
        }));
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
        objects.push({
          rowIndex: i,
          colIndex: j,
          value: cells[j].querySelector("input").value
        });
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
        options.push({
          value: option.value
        });
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
function stringifyCSV(data) {
  return stringify(data);
}
customElements.define("textarea-csv", TextareaCSV);

// src/table-sortable.js
var TableSortable = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.innerHTML = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          cursor: pointer;
        }
        th:hover {
          background-color: #ddd;
        }
        .search-container {
          margin-bottom: 10px;
        }
        input[type="text"] {
          padding: 6px;
          margin-top: 8px;
          margin-right: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      </style>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Search...">
        <select id="columnSelect">
          <!-- Column options will be added dynamically -->
        </select>
      </div>
      <div id="tableContainer"></div>
    `;
    this.tableContainer = this.shadowRoot.getElementById("tableContainer");
    this.searchInput = this.shadowRoot.getElementById("searchInput");
    this.columnSelect = this.shadowRoot.getElementById("columnSelect");
  }
  connectedCallback() {
    const table = this.querySelector("table");
    if (table) {
      const tableClone = table.cloneNode(true);
      this.tableContainer.appendChild(tableClone);
      this.setupTableSortable(tableClone);
      this.setupSearch(tableClone);
    }
  }
  setupTableSortable(table) {
    const headers = table.querySelectorAll("thead th");
    const tbody = table.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    headers.forEach((header, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = header.textContent.trim();
      this.columnSelect.appendChild(option);
    });
    headers.forEach((header, index) => {
      header.addEventListener("click", () => {
        this.sortTable(index, rows);
      });
    });
  }
  setupSearch(table) {
    this.searchInput.addEventListener("input", () => {
      const searchTerm = this.searchInput.value.toLowerCase();
      const columnIndex = parseInt(this.columnSelect.value);
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cell = row.cells[columnIndex];
        const cellText = cell.textContent.toLowerCase();
        if (cellText.includes(searchTerm)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }
  sortTable(columnIndex, rows) {
    const tbody = this.tableContainer.querySelector("tbody");
    const rowsArray = Array.from(rows);
    const isAscending = !this.isSortedAscending(columnIndex);
    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent;
      const cellB = rowB.cells[columnIndex].textContent;
      return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    rowsArray.forEach((row) => tbody.appendChild(row));
  }
  isSortedAscending(columnIndex) {
    const table = this.tableContainer.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");
    for (let i = 0; i < rows.length - 1; i++) {
      const cellA = rows[i].cells[columnIndex].textContent;
      const cellB = rows[i + 1].cells[columnIndex].textContent;
      if (cellA.localeCompare(cellB) > 0) {
        return false;
      }
    }
    return true;
  }
};
customElements.define("table-sortable", TableSortable);
export {
  TableSortable,
  TextareaAgentList,
  TextareaCSV,
  ULAtoZList,
  licenseText,
  releaseDate,
  releaseHash,
  version
};
