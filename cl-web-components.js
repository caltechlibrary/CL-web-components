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

// src/footer-global.js
var FooterGlobal = class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: "open"
    });
    const fontLink = document.createElement("link");
    fontLink.setAttribute("rel", "stylesheet");
    fontLink.setAttribute("href", "https://fonts.googleapis.com/css2?family=Hind:wght@400;600&display=swap");
    shadow.appendChild(fontLink);
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
            font-family: 'Hind', sans-serif;
            display: block;
            background-color: #062e47;
            color: #fff;
            }

            .footer-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto auto;
            gap: 20px;
            padding: 2rem;
            }

            .footer-bottom {
            grid-column: 1 / -1;
            text-align: right;
            }

            .footer-bottom a {
            color: inherit;
            }

            .footer-bottom a:hover {
            text-decoration: underline;
            }

            .footer-column {
            flex: 1 1 30%;
            margin: 0.5rem 0;
            }

            @media (max-width: 800px) {
            .footer-column {
                flex: 1 1 100%;
            }
            }

            h2 {
                font-size:30px;
                margin-block-end: .83em;
                margin-block-end: 16px;
                margin-top: 24px;
                margin-bottom: 12px;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                }

            a {
            color: inherit;
            text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }

            address {
                margin-bottom: 24px;
                font-style: normal;
                line-height: 1.5;
                unicode-bidi: isolate;
            }
            
            address a {
                display: block;
            }
            
            .u-email, .p-tell {
                line-height: 2;
            }

            .p-name {
                margin-block-start: 24px;
            }
            
            .social a svg {
                height: 32px;
            }

            .social a:not(:last-child) {
                margin-inline-end: 30px;
            }

            .logo {
                fill: #fff;
                margin-block: 24px;
                height: 5em;
            }
        
            .links {
                line-height: 2;
            }

            .list-unstyled {
                padding-left: 0;
                list-style: none;
            }

            ul {
                margin-top: 0;
            }

            .list-inline {
                padding-left: 0;
                list-style: none;
                margin-left: -5px;
            }
           
            .list-inline>li {
                display: inline-block;
                padding-right: 5px;
                padding-left: 5px;
            }

            .list-inline a {
                text-decoration: none;
            }
            
            ::slotted(.custom-footer-link) {
                color: white;
                text-decoration: none;
                padding: 5px;
                display: block;
            }

        </style>

        <footer class="footer-container">
            <div class="footer-column">
            <h2>Quick Links</h2>
                <div class="custom-links-wrapper">
                    <slot name="custom-links" part="custom-links">
                        <ul>
                            <li><a href="#">Default Link 1</a></li>
                            <li><a href="#">Default Link 2</a></li>
                        </ul>
                    </slot>
                </div>
            </div>

            <div class="footer-column">
            <h2>Contact Us</h2>
                <address class="h-card">
                    <a class="u-email" href="mailto:library@caltech.edu">library@caltech.edu</a>
                    <a class="p-tel" href="tel:+16263953405">626-395-3405</a>
                    <a class="p-name" href="https://library.caltech.edu/">Caltech Library</a>
                    <div class="p-adr h-adr">
                        <div class="p-post-office-box">Mail Code 1-43</div>
                        <div class="p-street-address">1200 E California Blvd</div>
                        <span class="p-locality">Pasadena</span> <abbr class="p-region" title="California">CA</abbr> <span class="p-postal-code">91125-4300</span>
                    </div>
                </address>
                <div class="social">
                    <a href="https://www.instagram.com/caltechlibrary/"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16" role="img" aria-labelledby="cl-ig-f">
                        <title id="cl-ig-f">Instagram</title>
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
                        </svg></a>
                    <a href="https://twitter.com/caltechlibrary"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16" role="img" aria-labelledby="cl-tw-f">
                        <title id="cl-tw-f">Twitter</title>
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
                        </svg></a>
                    <a href="https://www.youtube.com/channel/UCQbC4mcNNqypGMRtjgcN0SA"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16" role="img" aria-labelledby="cl-yt-f">
                        <title id="cl-yt-f">YouTube</title>
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"></path>
                        </svg></a>
                </div>
            </div>
            <div class="footer-column">
                <section class="links">
                    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190">
                    <path d="M72.52,26.4C68.66,9.47,56.28,1,40,1,15.83,1,1.67,20.6,1.67,43.44S14.12,85.94,40,85.94c16.13,0,26.93-7.84,33.4-24.09L59.57,55.49c-3,9.43-9,16.36-19.54,16.36-16.14,0-22.84-14.32-22.84-28.41S23.89,15,40,15c9.2,0,16.59,6.13,17.84,15.11L72.52,26.4Zm54.25,17.5C126.77,27.54,114.38,25,102,25c-12.61,0-24.54,5.22-24.54,18.74l13.86.57c0-6.25,2.61-8.63,10.68-8.63,6,0,10.91,1.59,10.91,7.27v1.7c-3.52,1.25-10,2.39-15,3.41l-5.8,1.14c-8.52,1.7-17.49,6.7-17.49,17.95s8.63,18.07,19.54,18.07a29.07,29.07,0,0,0,18.75-6.59,10.85,10.85,0,0,0,1.36,5.22h14.66c-.8-1.25-2.16-3.75-2.16-9.66V43.9ZM112.91,63.33c0,7.38-8.3,10.56-14.77,10.56-5,0-9-2.84-9-7.15,0-5.46,4.32-6.94,9.54-8l7.62-1.59a24.8,24.8,0,0,0,6.59-2v8.19Zm23.78,20.56h13.86V.72H136.69V83.89Zm23.23-70V70.71c0,8.75,3.86,13.86,15.22,13.86a51.43,51.43,0,0,0,11-1.36V71.85a59.08,59.08,0,0,1-6.14.68c-5.34,0-6.25-2.5-6.25-7V36.4h12.39v-10H173.78V0L159.92,13.88Zm84,44.56c0-20.57-8.4-33.4-27.61-33.4-18.63,0-29.43,13-29.43,30.1s10.8,30.12,29.43,30.12c15.68,0,24-7.5,28.3-14.09L232.9,64.35c-1.36,1.93-5.68,8.18-16.59,8.18-7.5,0-14.65-5.57-14.88-14.09ZM201.43,47.76A14.79,14.79,0,0,1,216.31,36.4c9.32,0,13.07,8.29,13.07,11.36ZM302.29,41.4C298.77,32.76,292,25,278,25c-18.63,0-29.43,13-29.43,30.1S259.34,85.26,277,85.26c15.57,0,22.16-9.21,26-17.62l-11.82-6.25c-2.15,5.23-5.68,11.14-14,11.14-9.66,0-14.09-8.41-14.09-17.39s5-17.38,14.88-17.38A12.78,12.78,0,0,1,290.13,47l12.16-5.56Zm4.32,42.49h13.86V54.35c0-7,3.18-15.91,13.63-15.91,7,0,10.23,3.41,10.23,11.36V83.89h13.86V45.83c0-16.71-11.25-20.79-21-20.79-7.84,0-13.41,3.06-16.47,7h-.23V.72H306.61V83.89Z"></path>
                    <path d="M16.1,129.71c0-5.34-.17-14.19-.25-15.69-.17-2.17-.58-3-3.09-3H8.84c-.5,0-.58-.41-.58-.83v-1.84c0-.41.08-.58.58-.58.92,0,3.92.25,10.85.25,8.09,0,11.6-.25,12.35-.25s.75.25.75.67v1.92c0,.41-.17.66-.83.66H27c-2.59,0-2.92.84-2.92,3.26,0,1.08-.25,13.68-.25,19.53V141c0,1.42,0,19.45.25,22.87,1.84.16,18.36.33,20.94,0,4.93-.75,9.93-10.77,11.1-14,.17-.34.34-.5.67-.34l1.34.5c.25.17.25.26.16.76-.25.58-3.59,14.35-4.09,16.6-1.08-.08-7.59-.16-15-.16s-15.6-.09-20.11-.09c-3.25,0-5.67.09-7.42.09s-2.67.16-3.26.16-.67-.16-.67-.58v-2.09c0-.42.09-.58.59-.58h4c3.09,0,3.59-1.17,3.59-2.26,0-1.58.25-22.36.25-27.45Z"></path>
                    <path d="M68.18,142.81c0-2.84-.5-4.34-4.67-5-.59-.08-.75-.25-.75-.58v-.75c0-.25.16-.42.58-.59a67.1,67.1,0,0,0,9-4.09,3.51,3.51,0,0,1,1.59-.5c.42,0,.5.42.42,1-.17,1.42-.17,6.68-.17,13.61V155c0,3.26,0,6.26.08,7.18.17,1.58.42,2.17,1.34,2.17h3.84c.66,0,.83.25.83.75v1.42c0,.58-.17.83-.75.83s-4.51-.25-8-.25c-4.84,0-8.1.25-9,.25-.42,0-.67-.16-.67-.67V165c0-.5.25-.66.83-.66h4.09c.92,0,1.25-.34,1.34-1.67.08-2.5.08-5.09.08-7.6Zm-3.92-25.62a4.92,4.92,0,0,1,5.26-4.67,4.39,4.39,0,0,1,4.5,4.42,4.78,4.78,0,0,1-5,4.92C67.1,121.86,64.26,119.94,64.26,117.19Z"></path>
                    <path d="M88,122.11c0-5.59-.92-6.76-3.92-7.76l-.84-.25c-.92-.25-1.08-.42-1.08-.67v-.66c0-.25.16-.42.67-.67a90.64,90.64,0,0,0,8.84-4.59,3.45,3.45,0,0,1,1.75-.75c.59,0,.76.42.67,1.42-.08.66-.08,10.18-.08,17.6v9.68c2.67-2.58,7.42-4.17,11.51-4.17,7.35,0,15.27,5.93,15.27,17.86,0,9.76-7.84,18.94-17.35,18.94-4.68,0-7.93-1-9.85-2.17l-3.34,1.84a1.2,1.2,0,0,1-1.08.25l-1-.25c-.34-.08-.42-.25-.34-.67.17-1.17.17-8.09.17-14.18Zm6,27c0,6.93.25,9.43,1.25,12.1.83,2,4.34,4.17,7.93,4.17,5,0,11.18-3.42,11.18-14.35,0-8.1-4.26-15.77-12.43-15.77a11.09,11.09,0,0,0-7.93,3Z"></path>
                    <path d="M132.11,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.91-.75h3.26c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M183.43,163.42a3.85,3.85,0,0,0,2.92-1.25c.34-.42.5-.59.83-.34l.84.67c.25.25.42.67-.08,1.5a6.89,6.89,0,0,1-6.51,4.09c-3,0-5.18-2.17-5.93-5.59h-.16a18,18,0,0,1-8.27,5.09,15.65,15.65,0,0,1-4.92.5c-2,0-5-1.67-5-6.92,0-3.84,1.76-7.18,8.35-10.1,3.75-1.67,8.09-3.67,9.43-4.84v-5.34c-.17-1.42-.25-3.59-1.17-4.67s-2.59-1.84-5-1.84a9.37,9.37,0,0,0-5.42,1.75c-1.17,1.09-.42,2.34-.42,3.84,0,2.92-1,4.76-4.42,4.76-1.34,0-2-.75-2-2.67,0-2.67,2.33-5.84,5.75-7.85a18.49,18.49,0,0,1,10.19-2.92c3.92,0,5.5,1.17,6.67,2.26,1.75,1.75,1.84,3.67,1.84,5.92v17.69C180.93,161.92,181.93,163.42,183.43,163.42Zm-8.59-14.69c-3,2.26-11.19,3.92-11.19,10.85,0,3.09,1.84,4.59,4.34,4.59s6.85-2.92,6.85-5.17Z"></path>
                    <path d="M196.62,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.92-.75h3.25c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M219.82,185.53c0-1.75,1.84-3.25,3.84-3.25a14.25,14.25,0,0,1,3.84.92,2,2,0,0,0,1.75-.5c1.25-1.51,5.51-11,6.68-14.27-.42-2.09-9.27-28.21-9.93-30-1-2.09-1.76-3.51-3.93-3.51H219.9c-.58,0-.67-.25-.67-.75v-1.67c0-.33.09-.58.67-.58.75,0,2.76.25,7.68.25,4.26,0,6.84-.25,7.76-.25.67,0,.75.25.75.58v1.76c0,.41-.08.66-.5.66H234c-.92,0-1.26.59-1.09,1.84.25,1.84,5.93,20.28,6.84,22.11h.34c.83-1.33,8.09-18.69,8.59-20.78s-.16-3.17-1.41-3.17h-1.34c-.5,0-.59-.25-.59-.66v-1.67c0-.42.09-.67.51-.67,1.08,0,2.83.25,6.84.25,2.25,0,4.17-.25,5.09-.25.5,0,.5.33.5.67v1.58c0,.5,0,.75-.42.75h-1.33a3.73,3.73,0,0,0-2.92,1.51c-1.84,2.25-7.35,15-13.11,28.12-4.08,9.26-7.34,17-8.84,19.77-1.17,2.18-2.67,5.43-7.09,5.43C221.41,189.79,219.82,188,219.82,185.53Z"></path>
                    </svg>
                    <ul class="list-unstyled">
                        <li><a href="https://library.caltech.edu/opportunities">Jobs &amp; Opportunities</a></li>
                        <li><a href="https://library.caltech.edu/staff">Staff Directory</a></li>
                        <li><a href="https://library.caltech.edu/mission">Mission Statement</a></li>
                        <li><a href="https://caltech.imodules.com/supportcaltechlibraries">Donate</a></li>
                    </ul>
                </section>
            </div>
            <div class="footer-bottom">
            <ul class="list-inline">
            <li><a href="https://library.caltech.edu/privacy">Privacy</a></li>
            <li><a href="https://www.caltech.edu/claimed-copyright-infringement">Copyright</a></li>
            <li><a href="https://library.caltech.edu/accessibility">Accessibility</a></li>
            <li id="footer-login" class="libanswers-js libguides-js"><a href="https://caltech.libapps.com/libapps/login.php?site_id=64&amp;target64=L2xpYmd1aWRlcy9hZG1pbl9jLnBocD9nPTEyMTI1OTAmcD04ODY5MTAz" aria-label="Staff Login"><i class="fa fa-sign-in" aria-hidden="true"></i></a></li>
            </ul>
            </div>
        </footer>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "underline";
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "none";
      }
    });
  }
};
customElements.define("footer-global", FooterGlobal);

// src/footer-global-lite.js
var FooterGlobalLite = class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: "open"
    });
    const fontLink = document.createElement("link");
    fontLink.setAttribute("rel", "stylesheet");
    fontLink.setAttribute("href", "https://fonts.googleapis.com/css2?family=Hind:wght@400;600&display=swap");
    shadow.appendChild(fontLink);
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
            font-family: 'Hind', sans-serif;
            display: block;
            background-color: #062e47;
            color: #fff;
            }

            .footer-container {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            grid-template-rows: auto auto;
            gap: 10px;
            padding: 2rem;
            padding-right: 4rem;
            padding-bottom: 1rem;
            }

            .footer-bottom {
            grid-column: 1 / -1;
            text-align: left;
            padding-left: 4rem;
            margin-bottom: 0;
            }

            .footer-bottom a {
            color: inherit;
            }

            .footer-bottom a:hover {
            text-decoration: underline;
            }

            .footer-column {
            flex: 1 1 30%;
            margin: 0.5rem 0;
            }
            .footer-column:first-of-type {
                margin-left: 4rem;
            }

            @media (max-width: 800px) {
            .footer-column {
                flex: 1 1 100%;
            }
            }

            h2 {
                font-size:30px;
                margin-block-end: .83em;
                margin-block-end: 16px;
                margin-top: 24px;
                margin-bottom: 12px;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                }

            a {
            color: inherit;
            text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }

            address {
                margin-bottom: 24px;
                font-style: normal;
                line-height: 1.5;
                unicode-bidi: isolate;
            }
            
            address a {
                display: block;
            }
            
            .u-email, .p-tell {
                line-height: 2;
            }

            .p-name {
                margin-block-start: 24px;
            }
            
            .social a svg {
                height: 32px;
            }

            .social a:not(:last-child) {
                margin-inline-end: 30px;
            }

            .logo {
                fill: #fff;
                margin-block: 24px;
                height: 5em;
            }
        
            .links {
                line-height: 2;
            }

            .list-unstyled {
                padding-left: 0;
                list-style: none;
            }

            ul {
                margin-top: 0;
            }

            .list-inline {
                padding-left: 0;
                list-style: none;
                margin-left: -5px;
            }
           
            .list-inline>li {
                display: inline-block;
                padding-right: 5px;
                padding-left: 5px;
            }

            .list-inline a {
                text-decoration: none;
            }
            
            ::slotted(.custom-footer-link) {
                color: white;
                text-decoration: none;
                padding: 5px;
                display: block;
            }

        </style>

        <footer class="footer-container">
            <div class="footer-column">
             <section class="links">
                    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190">
                    <path d="M72.52,26.4C68.66,9.47,56.28,1,40,1,15.83,1,1.67,20.6,1.67,43.44S14.12,85.94,40,85.94c16.13,0,26.93-7.84,33.4-24.09L59.57,55.49c-3,9.43-9,16.36-19.54,16.36-16.14,0-22.84-14.32-22.84-28.41S23.89,15,40,15c9.2,0,16.59,6.13,17.84,15.11L72.52,26.4Zm54.25,17.5C126.77,27.54,114.38,25,102,25c-12.61,0-24.54,5.22-24.54,18.74l13.86.57c0-6.25,2.61-8.63,10.68-8.63,6,0,10.91,1.59,10.91,7.27v1.7c-3.52,1.25-10,2.39-15,3.41l-5.8,1.14c-8.52,1.7-17.49,6.7-17.49,17.95s8.63,18.07,19.54,18.07a29.07,29.07,0,0,0,18.75-6.59,10.85,10.85,0,0,0,1.36,5.22h14.66c-.8-1.25-2.16-3.75-2.16-9.66V43.9ZM112.91,63.33c0,7.38-8.3,10.56-14.77,10.56-5,0-9-2.84-9-7.15,0-5.46,4.32-6.94,9.54-8l7.62-1.59a24.8,24.8,0,0,0,6.59-2v8.19Zm23.78,20.56h13.86V.72H136.69V83.89Zm23.23-70V70.71c0,8.75,3.86,13.86,15.22,13.86a51.43,51.43,0,0,0,11-1.36V71.85a59.08,59.08,0,0,1-6.14.68c-5.34,0-6.25-2.5-6.25-7V36.4h12.39v-10H173.78V0L159.92,13.88Zm84,44.56c0-20.57-8.4-33.4-27.61-33.4-18.63,0-29.43,13-29.43,30.1s10.8,30.12,29.43,30.12c15.68,0,24-7.5,28.3-14.09L232.9,64.35c-1.36,1.93-5.68,8.18-16.59,8.18-7.5,0-14.65-5.57-14.88-14.09ZM201.43,47.76A14.79,14.79,0,0,1,216.31,36.4c9.32,0,13.07,8.29,13.07,11.36ZM302.29,41.4C298.77,32.76,292,25,278,25c-18.63,0-29.43,13-29.43,30.1S259.34,85.26,277,85.26c15.57,0,22.16-9.21,26-17.62l-11.82-6.25c-2.15,5.23-5.68,11.14-14,11.14-9.66,0-14.09-8.41-14.09-17.39s5-17.38,14.88-17.38A12.78,12.78,0,0,1,290.13,47l12.16-5.56Zm4.32,42.49h13.86V54.35c0-7,3.18-15.91,13.63-15.91,7,0,10.23,3.41,10.23,11.36V83.89h13.86V45.83c0-16.71-11.25-20.79-21-20.79-7.84,0-13.41,3.06-16.47,7h-.23V.72H306.61V83.89Z"></path>
                    <path d="M16.1,129.71c0-5.34-.17-14.19-.25-15.69-.17-2.17-.58-3-3.09-3H8.84c-.5,0-.58-.41-.58-.83v-1.84c0-.41.08-.58.58-.58.92,0,3.92.25,10.85.25,8.09,0,11.6-.25,12.35-.25s.75.25.75.67v1.92c0,.41-.17.66-.83.66H27c-2.59,0-2.92.84-2.92,3.26,0,1.08-.25,13.68-.25,19.53V141c0,1.42,0,19.45.25,22.87,1.84.16,18.36.33,20.94,0,4.93-.75,9.93-10.77,11.1-14,.17-.34.34-.5.67-.34l1.34.5c.25.17.25.26.16.76-.25.58-3.59,14.35-4.09,16.6-1.08-.08-7.59-.16-15-.16s-15.6-.09-20.11-.09c-3.25,0-5.67.09-7.42.09s-2.67.16-3.26.16-.67-.16-.67-.58v-2.09c0-.42.09-.58.59-.58h4c3.09,0,3.59-1.17,3.59-2.26,0-1.58.25-22.36.25-27.45Z"></path>
                    <path d="M68.18,142.81c0-2.84-.5-4.34-4.67-5-.59-.08-.75-.25-.75-.58v-.75c0-.25.16-.42.58-.59a67.1,67.1,0,0,0,9-4.09,3.51,3.51,0,0,1,1.59-.5c.42,0,.5.42.42,1-.17,1.42-.17,6.68-.17,13.61V155c0,3.26,0,6.26.08,7.18.17,1.58.42,2.17,1.34,2.17h3.84c.66,0,.83.25.83.75v1.42c0,.58-.17.83-.75.83s-4.51-.25-8-.25c-4.84,0-8.1.25-9,.25-.42,0-.67-.16-.67-.67V165c0-.5.25-.66.83-.66h4.09c.92,0,1.25-.34,1.34-1.67.08-2.5.08-5.09.08-7.6Zm-3.92-25.62a4.92,4.92,0,0,1,5.26-4.67,4.39,4.39,0,0,1,4.5,4.42,4.78,4.78,0,0,1-5,4.92C67.1,121.86,64.26,119.94,64.26,117.19Z"></path>
                    <path d="M88,122.11c0-5.59-.92-6.76-3.92-7.76l-.84-.25c-.92-.25-1.08-.42-1.08-.67v-.66c0-.25.16-.42.67-.67a90.64,90.64,0,0,0,8.84-4.59,3.45,3.45,0,0,1,1.75-.75c.59,0,.76.42.67,1.42-.08.66-.08,10.18-.08,17.6v9.68c2.67-2.58,7.42-4.17,11.51-4.17,7.35,0,15.27,5.93,15.27,17.86,0,9.76-7.84,18.94-17.35,18.94-4.68,0-7.93-1-9.85-2.17l-3.34,1.84a1.2,1.2,0,0,1-1.08.25l-1-.25c-.34-.08-.42-.25-.34-.67.17-1.17.17-8.09.17-14.18Zm6,27c0,6.93.25,9.43,1.25,12.1.83,2,4.34,4.17,7.93,4.17,5,0,11.18-3.42,11.18-14.35,0-8.1-4.26-15.77-12.43-15.77a11.09,11.09,0,0,0-7.93,3Z"></path>
                    <path d="M132.11,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.91-.75h3.26c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M183.43,163.42a3.85,3.85,0,0,0,2.92-1.25c.34-.42.5-.59.83-.34l.84.67c.25.25.42.67-.08,1.5a6.89,6.89,0,0,1-6.51,4.09c-3,0-5.18-2.17-5.93-5.59h-.16a18,18,0,0,1-8.27,5.09,15.65,15.65,0,0,1-4.92.5c-2,0-5-1.67-5-6.92,0-3.84,1.76-7.18,8.35-10.1,3.75-1.67,8.09-3.67,9.43-4.84v-5.34c-.17-1.42-.25-3.59-1.17-4.67s-2.59-1.84-5-1.84a9.37,9.37,0,0,0-5.42,1.75c-1.17,1.09-.42,2.34-.42,3.84,0,2.92-1,4.76-4.42,4.76-1.34,0-2-.75-2-2.67,0-2.67,2.33-5.84,5.75-7.85a18.49,18.49,0,0,1,10.19-2.92c3.92,0,5.5,1.17,6.67,2.26,1.75,1.75,1.84,3.67,1.84,5.92v17.69C180.93,161.92,181.93,163.42,183.43,163.42Zm-8.59-14.69c-3,2.26-11.19,3.92-11.19,10.85,0,3.09,1.84,4.59,4.34,4.59s6.85-2.92,6.85-5.17Z"></path>
                    <path d="M196.62,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.92-.75h3.25c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M219.82,185.53c0-1.75,1.84-3.25,3.84-3.25a14.25,14.25,0,0,1,3.84.92,2,2,0,0,0,1.75-.5c1.25-1.51,5.51-11,6.68-14.27-.42-2.09-9.27-28.21-9.93-30-1-2.09-1.76-3.51-3.93-3.51H219.9c-.58,0-.67-.25-.67-.75v-1.67c0-.33.09-.58.67-.58.75,0,2.76.25,7.68.25,4.26,0,6.84-.25,7.76-.25.67,0,.75.25.75.58v1.76c0,.41-.08.66-.5.66H234c-.92,0-1.26.59-1.09,1.84.25,1.84,5.93,20.28,6.84,22.11h.34c.83-1.33,8.09-18.69,8.59-20.78s-.16-3.17-1.41-3.17h-1.34c-.5,0-.59-.25-.59-.66v-1.67c0-.42.09-.67.51-.67,1.08,0,2.83.25,6.84.25,2.25,0,4.17-.25,5.09-.25.5,0,.5.33.5.67v1.58c0,.5,0,.75-.42.75h-1.33a3.73,3.73,0,0,0-2.92,1.51c-1.84,2.25-7.35,15-13.11,28.12-4.08,9.26-7.34,17-8.84,19.77-1.17,2.18-2.67,5.43-7.09,5.43C221.41,189.79,219.82,188,219.82,185.53Z"></path>
                    </svg>

                    <address class="h-card">
                        <a class="u-email" href="mailto:library@caltech.edu">library@caltech.edu</a>
                        <a class="p-tel" href="tel:+16263953405">626-395-3405</a>
                    </address>
                    
                </section>
            </div>

            <div class="footer-column">
               <h2>Quick Links</h2>
                <div class="custom-links-wrapper">
                    <slot name="custom-links" part="custom-links">
                        <ul>
                            <li><a href="#">Default Link 1</a></li>
                            <li><a href="#">Default Link 2</a></li>
                        </ul>
                    </slot>
                </div>
            </div>

            
            <div class="footer-bottom">
            <ul class="list-inline">
            <li><a href="https://library.caltech.edu/privacy">Privacy</a></li>
            <li><a href="https://www.caltech.edu/claimed-copyright-infringement">Copyright</a></li>
            <li><a href="https://library.caltech.edu/accessibility">Accessibility</a></li>
            <li id="footer-login" class="libanswers-js libguides-js"><a href="https://caltech.libapps.com/libapps/login.php?site_id=64&amp;target64=L2xpYmd1aWRlcy9hZG1pbl9jLnBocD9nPTEyMTI1OTAmcD04ODY5MTAz" aria-label="Staff Login"><i class="fa fa-sign-in" aria-hidden="true"></i></a></li>
            </ul>
            </div>
        </footer>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "underline";
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "none";
      }
    });
  }
};
customElements.define("footer-global-lite", FooterGlobalLite);
export {
  FooterGlobal,
  FooterGlobalLite,
  TableSortable,
  TextareaAgentList,
  TextareaCSV,
  ULAtoZList,
  licenseText,
  releaseDate,
  releaseHash,
  version
};
