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

        /* -------------------------
           Base Styles
        -------------------------- */
        :host {
          font-family: 'Hind', sans-serif;
          display: block;
          background-color: #062e47;
          color: #fff;
          border-radius: 0 30% 0 0 / 5%;
        }

        @media (min-width: 768px) {
          :host {
            border-radius: 0 30% 0 0 / 10%;
           }
        }

        @media (min-width: 992px) {
          :host {
            border-radius: 0 30% 0 0 / 20%;
          }
        }
        
        /* -------------------------
           Layout & Structure
        -------------------------- */

        .footer-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 1150px;
          margin: auto;
        }

        .footer-column {
          padding: 1rem 0;
        }

        .footer-column.column1 {
          flex: 0 1 40%;
          margin-right: 7.6rem;
        }

        .footer-column.column2 {
          flex: 0 1 21%;
          margin-right: 3.6rem;
        }

        .footer-column.column3 {
          flex: 0 1 21%;
        }

        :host([custom]) .footer-column.column1 {
          flex: 0 1 30%;
          margin-right: 3rem;
        }

        /* Adjust column layout if 'custom' attribute is present */

        :host([custom]) .footer-column.column2 {
          flex: 0 1 30%;
          margin-right: 3rem;
        }

        :host([custom]) .footer-column.column3 {
          flex: 0 1 30%;
        }

        /* -------------------------
           Footer Bottom Area
        -------------------------- */

        .footer-bottom {
          flex: 1 1 100%;
          text-align: right;
          margin: 2rem 5rem 0 0;
        }


        /* -------------------------
           Typography
        -------------------------- */

        h2 {
          font-size: 30px;
          margin-block-end: 16px;
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 500;
          line-height: 1.1;
          color: inherit;
        }

        /* -------------------------
           Lists
        -------------------------- */

        ul {
          margin-top: 0;
        }

        .list-unstyled {
          padding-left: 0;
          list-style: none;
        }

        .list-inline {
          padding-left: 0;
          list-style: none;
          margin-left: -5px;
        }

        .list-inline > li {
          display: inline-block;
          padding-right: 5px;
          padding-left: 5px;
        }

        .list-inline a {
          text-decoration: none;
        }


        /* -------------------------
           Links
        -------------------------- */

        a {
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .footer-bottom a {
          color: inherit;
        }

        .footer-bottom a:hover {
          text-decoration: underline;
        }

        ::slotted(.custom-links) {
          color: white;
          text-decoration: none;
          padding: 5px;
          display: block;
        }


        /* -------------------------
           Responsive Styles
        -------------------------- */

        @media (max-width: 1024px) {
          .footer-container {
            flex-direction: column;
            align-items: stretch;
            margin: 0 4rem 0 1rem;
          }

          .footer-column {
            flex: 0 0 100%;
            width: 100%;
          }

          .footer-bottom {
            flex: 0 0 100%;
            text-align: left;
            padding: 1rem 0;
            border-top: grey dotted 1px;
          }
        }


        /* -------------------------
           Library Hours
        -------------------------- */

        .library-hours {
          background-color: #013049;
          padding: 0 1rem 1rem 0;
          border-radius: 6px;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .library-hours strong {
          font-size: 1.1rem;
          display: block;
          margin-bottom: 0.25em;
        }

        .library-hours .today {
          font-size: 1rem;
          margin: 1.25rem 0;
          color: #eee;
          display: block;
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dotted #fff;
          padding: 4px 0;
        }

        .hours-row:last-of-type {
          border-bottom: none;
        }

        .lib-link {
          color: #fff;
          text-decoration: none;
        }

        .lib-link:hover {
          text-decoration: underline;
        }

        .lib-hours {
          white-space: nowrap;
          font-weight: 500;
        }

        .hours-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 1em;
          font-size: 0.75rem;
        }

        .view-all {
          color: #fff;
          text-decoration: none;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .footnote {
          color: #ccc;
        }


        /* -------------------------
           Contact Us
        -------------------------- */

        address {
          margin-bottom: 24px;
          font-style: normal;
          line-height: 1.5;
          unicode-bidi: isolate;
        }

        address a {
          display: block;
        }

        .u-email,
        .p-tell {
          line-height: 2;
        }

        .p-name {
          margin-block-start: 24px;
        }

        /* -------------------------
           Social & Branding
        -------------------------- */

        .social a svg {
          height: 32px;
        }

        .social a:not(:last-child) {
          margin-inline-end: 30px;
        }

        .logo-library {
          fill: #fff;
          margin-block: 24px;
          height: 5em;
        }

         .logo-archives {
          fill: #fff;
          margin-block: 24px;
          height: 5em;
        }

        .links {
          line-height: 2;
        }

        /* Force Font Awesome rendering inside the component */
        i.fa {
          font-family: 'FontAwesome';
          font-style: normal;
          font-weight: normal;
          speak: none;
        }
        </style>

      <footer class="footer-container" role="contentinfo">
        <div class="footer-column column1">
          <div class="custom-links-wrapper">
            <h2 id="column1-header">Hours</h2>
            <slot name="custom-links"></slot>
            <div id="default-column1" hidden aria-live="polite">
              <p>Loading library hours...</p>
            </div>
          </div>
        </div>

        <div class="footer-column column2">
          <h2>Contact Us</h2>
          <address class="h-card">
            <a id="email-link" class="u-email" href="mailto:library@caltech.edu">library@caltech.edu</a>
            <a id="phone-link" class="p-tel" href="tel:6263953405">626-395-3405</a>
            <a class="p-name" href="https://library.caltech.edu/">Caltech Library</a>
            <div class="p-adr h-adr">
              <div class="p-post-office-box">Mail Code 1-43</div>
              <div class="p-street-address">1200 E California Blvd</div>
              <span class="p-locality">Pasadena</span>
              <abbr class="p-region" title="California">CA</abbr>
              <span class="p-postal-code">91125-4300</span>
            </div>
          </address>
          <div class="social">
            <a id="instagram-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16" role="img" aria-labelledby="cl-ig-f">
                <title id="cl-ig-f">Instagram</title>
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
              </svg>
            </a>
            <a id="youtube-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16" role="img" aria-labelledby="cl-yt-f">
                <title id="cl-yt-f">YouTube</title>
                <path d="M8.051 1.999h-.002C3.833 2 2.518 2.138 1.857 2.31a2.01 2.01 0 0 0-1.42 1.419C.263 4.508.125 5.823.125 8c0 2.177.138 3.492.312 4.271a2.01 2.01 0 0 0 1.419 1.42c.68.17 1.995.309 6.195.309s5.514-.14 6.195-.31a2.01 2.01 0 0 0 1.419-1.419c.174-.78.313-2.095.313-4.272 0-2.177-.139-3.492-.313-4.272a2.01 2.01 0 0 0-1.419-1.418C13.566 2.137 12.251 2 8.051 1.999zM6.553 5.568l3.49 2.06-3.49 2.06V5.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-column column3">
          <section class="links">
            <div class="footer-logo-container"></div>
            <!-- Library Logo SVG Template -->
            <template id="library-logo">
              <!-- Begin Caltech Library Logo SVG -->
              <svg class="logo-library" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190">
                        <path d="M72.52,26.4C68.66,9.47,56.28,1,40,1,15.83,1,1.67,20.6,1.67,43.44S14.12,85.94,40,85.94c16.13,0,26.93-7.84,33.4-24.09L59.57,55.49c-3,9.43-9,16.36-19.54,16.36-16.14,0-22.84-14.32-22.84-28.41S23.89,15,40,15c9.2,0,16.59,6.13,17.84,15.11L72.52,26.4Zm54.25,17.5C126.77,27.54,114.38,25,102,25c-12.61,0-24.54,5.22-24.54,18.74l13.86.57c0-6.25,2.61-8.63,10.68-8.63,6,0,10.91,1.59,10.91,7.27v1.7c-3.52,1.25-10,2.39-15,3.41l-5.8,1.14c-8.52,1.7-17.49,6.7-17.49,17.95s8.63,18.07,19.54,18.07a29.07,29.07,0,0,0,18.75-6.59,10.85,10.85,0,0,0,1.36,5.22h14.66c-.8-1.25-2.16-3.75-2.16-9.66V43.9ZM112.91,63.33c0,7.38-8.3,10.56-14.77,10.56-5,0-9-2.84-9-7.15,0-5.46,4.32-6.94,9.54-8l7.62-1.59a24.8,24.8,0,0,0,6.59-2v8.19Zm23.78,20.56h13.86V.72H136.69V83.89Zm23.23-70V70.71c0,8.75,3.86,13.86,15.22,13.86a51.43,51.43,0,0,0,11-1.36V71.85a59.08,59.08,0,0,1-6.14.68c-5.34,0-6.25-2.5-6.25-7V36.4h12.39v-10H173.78V0L159.92,13.88Zm84,44.56c0-20.57-8.4-33.4-27.61-33.4-18.63,0-29.43,13-29.43,30.1s10.8,30.12,29.43,30.12c15.68,0,24-7.5,28.3-14.09L232.9,64.35c-1.36,1.93-5.68,8.18-16.59,8.18-7.5,0-14.65-5.57-14.88-14.09ZM201.43,47.76A14.79,14.79,0,0,1,216.31,36.4c9.32,0,13.07,8.29,13.07,11.36ZM302.29,41.4C298.77,32.76,292,25,278,25c-18.63,0-29.43,13-29.43,30.1S259.34,85.26,277,85.26c15.57,0,22.16-9.21,26-17.62l-11.82-6.25c-2.15,5.23-5.68,11.14-14,11.14-9.66,0-14.09-8.41-14.09-17.39s5-17.38,14.88-17.38A12.78,12.78,0,0,1,290.13,47l12.16-5.56Zm4.32,42.49h13.86V54.35c0-7,3.18-15.91,13.63-15.91,7,0,10.23,3.41,10.23,11.36V83.89h13.86V45.83c0-16.71-11.25-20.79-21-20.79-7.84,0-13.41,3.06-16.47,7h-.23V.72H306.61V83.89Z"></path>
                        <path d="M16.1,129.71c0-5.34-.17-14.19-.25-15.69-.17-2.17-.58-3-3.09-3H8.84c-.5,0-.58-.41-.58-.83v-1.84c0-.41.08-.58.58-.58.92,0,3.92.25,10.85.25,8.09,0,11.6-.25,12.35-.25s.75.25.75.67v1.92c0,.41-.17.66-.83.66H27c-2.59,0-2.92.84-2.92,3.26,0,1.08-.25,13.68-.25,19.53V141c0,1.42,0,19.45.25,22.87,1.84.16,18.36.33,20.94,0,4.93-.75,9.93-10.77,11.1-14,.17-.34.34-.5.67-.34l1.34.5c.25.17.25.26.16.76-.25.58-3.59,14.35-4.09,16.6-1.08-.08-7.59-.16-15-.16s-15.6-.09-20.11-.09c-3.25,0-5.67.09-7.42.09s-2.67.16-3.26.16-.67-.16-.67-.58v-2.09c0-.42.09-.58.59-.58h4c3.09,0,3.59-1.17,3.59-2.26,0-1.58.25-22.36.25-27.45Z"></path>
                        <path d="M68.18,142.81c0-2.84-.5-4.34-4.67-5-.59-.08-.75-.25-.75-.58v-.75c0-.25.16-.42.58-.59a67.1,67.1,0,0,0,9-4.09,3.51,3.51,0,0,1,1.59-.5c.42,0,.5.42.42,1-.17,1.42-.17,6.68-.17,13.61V155c0,3.26,0,6.26.08,7.18.17,1.58.42,2.17,1.34,2.17h3.84c.66,0,.83.25.83.75v1.42c0,.58-.17.83-.75.83s-4.51-.25-8-.25c-4.84,0-8.1.25-9,.25-.42,0-.67-.16-.67-.67V165c0-.5.25-.66.83-.66h4.09c.92,0,1.25-.34,1.34-1.67.08-2.5.08-5.09.08-7.6Zm-3.92-25.62a4.92,4.92,0,0,1,5.26-4.67,4.39,4.39,0,0,1,4.5,4.42,4.78,4.78,0,0,1-5,4.92C67.1,121.86,64.26,119.94,64.26,117.19Z"></path>
                        <path d="M88,122.11c0-5.59-.92-6.76-3.92-7.76l-.84-.25c-.92-.25-1.08-.42-1.08-.67v-.66c0-.25.16-.42.67-.67a90.64,90.64,0,0,0,8.84-4.59,3.45,3.45,0,0,1,1.75-.75c.59,0,.76.42.67,1.42-.08.66-.08,10.18-.08,17.6v9.68c2.67-2.58,7.42-4.17,11.51-4.17,7.35,0,15.27,5.93,15.27,17.86,0,9.76-7.84,18.94-17.35,18.94-4.68,0-7.93-1-9.85-2.17l-3.34,1.84a1.2,1.2,0,0,1-1.08.25l-1-.25c-.34-.08-.42-.25-.34-.67.17-1.17.17-8.09.17-14.18Zm6,27c0,6.93.25,9.43,1.25,12.1.83,2,4.34,4.17,7.93,4.17,5,0,11.18-3.42,11.18-14.35,0-8.1-4.26-15.77-12.43-15.77a11.09,11.09,0,0,0-7.93,3Z"></path>
                        <path d="M132.11,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.91-.75h3.26c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                        <path d="M183.43,163.42a3.85,3.85,0,0,0,2.92-1.25c.34-.42.5-.59.83-.34l.84.67c.25.25.42.67-.08,1.5a6.89,6.89,0,0,1-6.51,4.09c-3,0-5.18-2.17-5.93-5.59h-.16a18,18,0,0,1-8.27,5.09,15.65,15.65,0,0,1-4.92.5c-2,0-5-1.67-5-6.92,0-3.84,1.76-7.18,8.35-10.1,3.75-1.67,8.09-3.67,9.43-4.84v-5.34c-.17-1.42-.25-3.59-1.17-4.67s-2.59-1.84-5-1.84a9.37,9.37,0,0,0-5.42,1.75c-1.17,1.09-.42,2.34-.42,3.84,0,2.92-1,4.76-4.42,4.76-1.34,0-2-.75-2-2.67,0-2.67,2.33-5.84,5.75-7.85a18.49,18.49,0,0,1,10.19-2.92c3.92,0,5.5,1.17,6.67,2.26,1.75,1.75,1.84,3.67,1.84,5.92v17.69C180.93,161.92,181.93,163.42,183.43,163.42Zm-8.59-14.69c-3,2.26-11.19,3.92-11.19,10.85,0,3.09,1.84,4.59,4.34,4.59s6.85-2.92,6.85-5.17Z"></path>
                        <path d="M196.62,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.92-.75h3.25c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                        <path d="M219.82,185.53c0-1.75,1.84-3.25,3.84-3.25a14.25,14.25,0,0,1,3.84.92,2,2,0,0,0,1.75-.5c1.25-1.51,5.51-11,6.68-14.27-.42-2.09-9.27-28.21-9.93-30-1-2.09-1.76-3.51-3.93-3.51H219.9c-.58,0-.67-.25-.67-.75v-1.67c0-.33.09-.58.67-.58.75,0,2.76.25,7.68.25,4.26,0,6.84-.25,7.76-.25.67,0,.75.25.75.58v1.76c0,.41-.08.66-.5.66H234c-.92,0-1.26.59-1.09,1.84.25,1.84,5.93,20.28,6.84,22.11h.34c.83-1.33,8.09-18.69,8.59-20.78s-.16-3.17-1.41-3.17h-1.34c-.5,0-.59-.25-.59-.66v-1.67c0-.42.09-.67.51-.67,1.08,0,2.83.25,6.84.25,2.25,0,4.17-.25,5.09-.25.5,0,.5.33.5.67v1.58c0,.5,0,.75-.42.75h-1.33a3.73,3.73,0,0,0-2.92,1.51c-1.84,2.25-7.35,15-13.11,28.12-4.08,9.26-7.34,17-8.84,19.77-1.17,2.18-2.67,5.43-7.09,5.43C221.41,189.79,219.82,188,219.82,185.53Z"></path>
                    </svg>
                      <!-- End Caltech Library Logo SVG -->
                    </template>
                    <!-- Archives Logo SVG Template -->
                    <template id="archives-logo">
                      <svg class="logo-archives" xmlns="http://www.w3.org/2000/svg" width="210.808" height="128.998" viewBox="0 0 210.8076 128.99799" role="img">
                        <g transform="translate(-64.798, 0)">
                        <path d="M79.798 49.33V.61l.36-.36h7.67l.36.36v49.08h-8.03zm22.07-33.72h7.2v6h-7.2v18.6c0 .14.47 1.37.6 1.56 1.23 1.73 4.83.87 6.6.72v6.72c-5.53 1.21-14.32 2.07-15.33-5.43l-.02-35.49 8.15-8.29v15.6zm75.81 9.11-7.04 2.91c-2.27-5.94-9.63-7.21-13.71-2.18-4.08 5.03-2.68 16.51 4.8 17.28 5.21.54 7.44-2.21 9.59-6.45l6.74 3.57.11.35c-3.43 8.05-10.61 11.5-19.2 9.86-16.3-3.11-17.57-28.79-2.27-34.21 5.95-2.11 13.54-1.48 18 3.36.64.7 3.55 4.85 2.98 5.51zM75.238 49.69h-8.52l-.96-3.12c-5.21 4.62-15.36 5.71-20.16 0-2.42-2.87-3-6.92-1.81-10.45 2.76-8.19 15.35-7.31 22.05-9.74.67-4.91-4.43-5.64-8.18-5.18-3.05.37-4.59 1.76-4.5 4.97-1.04.02-7.96 0-8.3-.47.04-7.84 7.31-10.89 14.16-11.06 6.85-.17 14.34 1.56 15.02 9.48.55 6.44-.44 13.65 0 20.17.13 1.94.56 3.59 1.2 5.4zm-9.36-17.04c-3.84 2.31-15.84.89-13.75 8.12 1.38 4.78 11.02 3.06 13.14-.93.15-.28.61-1.34.61-1.55zm77.5 1.92h-25.19c.62 6.74 6.48 9.4 12.66 7.75 2.83-.76 4.06-2.44 6.17-4.14l6.59 3.61c.39.56-2.2 3.32-2.76 3.82-4.11 3.73-10.13 5.21-15.6 4.82-22.93-1.66-20.46-39.47 4.98-35.46 10.18 1.6 13.18 10.36 13.14 19.61zm-8.64-6.24c-1.41-9.37-14.59-8.77-16.56 0zM188.488.49v18.24l2.96-2.2c4.58-2.7 13.06-2.37 16.71 1.85 1.03 1.19 2.65 4.48 2.65 5.99v25.32h-8.16V27.73c0-.42-.65-2.24-.91-2.69-2.13-3.64-8.81-2.66-11.19.43-.86 1.12-2.06 4.27-2.06 5.62v18.6h-8.16V.49ZM.138 22.09c.46-4.83 3.21-11.18 6.47-14.77 9.06-9.95 27.86-9.41 33.88 3.57.37.8 1.74 4.12 1.29 4.74l-8.53 2.15c-1.4-10.01-14.43-11.7-20.25-4.3-5.95 7.56-4.92 24.67 5.31 28.25 7.37 2.57 14.02-1.5 15.91-8.82l8.35 3.7c-4.19 11.62-14.63 16.52-26.55 13.4C6.718 47.57.948 38.61.128 29.3c-.16-1.87-.18-5.34 0-7.2z" class="caltech-logotype"></path>
                        <path d="M152.611 107.36c1.274-1.278 3.686.457 2.364 1.91-1.322 1.452-3.704-.567-2.364-1.91zm-101.73-.456c1.36-.11 2.267 1.553 1.003 2.493-2.055 1.544-3.84-2.265-1.003-2.493zm2.537-27.84c2.21-.428 2.547 2.43.82 2.777-2.132.42-2.682-2.41-.82-2.776zm1.91 5.435v8.878l.386.292 1.466.037v.877h-4.978c-.067 0-.328.301-.578.219v-1.096l1.476-.028.347-.328c-.058-1.763.193-3.727.038-5.462-.096-1.096-.212-1.398-1.485-1.416-1.187-.493 2.836-2.01 3.328-1.973zm99.994 27.84v8.877c.435.54 1.216.292 1.853.329v1.096h-5.441c-.232 0-.599-.685-.126-.996l1.63-.1c.049-1.37.734-6.037-.231-6.905-.424-.374-1.505-.137-1.158-.877.087-.192 2.972-1.452 3.473-1.425zm-102.763 0v9.206l1.63.1.223.658-.348.329h-5.44v-1.096h1.851v-6.686c0-.347-2.064-.64-1.62-1.206l3.704-1.315zm-31.479-25.1c-.125-.429-1.505-.867-1.39-1.315l3.233-1.425.241 1.526c1.206-1.115 3.27-2.996 4.4-.759-.32 2.375-1.979.676-3.262 1.07-1.9.593-.926 5.434-1.11 7.005l.348.328 1.708.028-.106.886c-.415.575-2.152-.037-2.788-.037-.888 0-1.91.439-2.895.238v-1.096h1.621c-.318-1.681.434-5.015 0-6.467zm129.853 25.319c0 .429.154 1.114-.376 1.287l-3.078.046c-.174 1.535-.694 6.147.203 7.289.607.776 1.669.146 2.325.027 1.051-.192.733.676 0 1.096-1.525.859-3.734.767-4.563-.913-.666-1.343.366-7.115-.049-7.517h-1.852c-.067-.384-.01-.484.241-.758.888-.968 2.673-1.754 3.116-3.188l.58.128v2.503h3.472zM47.427 114.94c-.125.192-1.11.302-1.418.22-1.196-.32-.733-2.448-3.184-1.836-3.434.867-2.383 7.599.81 8.02.473.063 1.612.054 2.084-.02.782-.127 2.2-1.643 2.103-.2-2.083 2.037-5.778 2.539-7.872.219-3.347-3.717.106-9.974 5.451-8.896 1.023.21 2.73 1.443 2.036 2.503zm90.482-2.548c1.273-.192 2.76-.119 3.772.713 1.602 1.306.135 2.785-1.187 1.771-.83-.639-.79-1.854-2.392-1.653-3.936.484-2.73 7.645.222 8.093.656.1 2.228.09 2.826-.156.251-.1 1.467-1.342 1.68-.383.192.85-3.03 2.018-3.821 2.082-7.062.557-6.985-9.58-1.1-10.476zM33.969 85.66c-1.07-.84-2.71-.045-3.367.96-2.364 3.625 1.698 9.279 6.097 5.99l.579.549c-1.187 1.078-3.039 1.954-4.708 1.854-6.86-.42-5.894-11.664 2.036-10.494 2.402.356 3 3.169.993 2.804-1.07-.201-1.138-1.27-1.62-1.654zm45.902 5.645.887.036c.705 2.028 1.891 3.58 4.226 2.064 1.331-3.863-3.917-1.99-4.891-5.27-1.168-3.927 6.319-5.315 6.637-1.434.164 2.037-1.949-.83-2.21-.995-1.109-.694-2.96-.192-3 1.105-.057 2.1 3.734 1.534 4.892 3.242 2.141 3.17-2.103 6.147-5.451 4.503-1.023-.502-.897-2.292-1.09-3.242Zm111.098 23.884c-1.215.301-1.312-.968-1.92-1.461-1.08-.868-3.135-.612-3.174.922-.058 1.863 1.91 1.626 3.252 2.183 3.907 1.626 1.929 6.32-2.19 6.037-2.653-.182-2.711-1.552-2.663-3.735 1.39-.137 1.273 2.247 2.48 2.585 1.6.447 3.453-.348 2.672-2.092-.782-1.745-5.162-1.032-5.162-4.33 0-3.698 7.226-4.347 6.734-.109zM62.274 85.595l-.936.1-.183.393 2.161 6.074c.482-.84 2.962-6.074 2.422-6.567-.618 0-1.274 0-1.149-.776.203-.603 3.695-.027 4.4-.329v1.096c-.319.01-.685-.046-.994.046-.955.283-3.454 6.667-4.13 7.928-.443.83-.925 2.183-1.755.85-1.38-2.22-1.978-5.892-3.338-8.24-.318-.639-.926-.62-1.582-.584l.106-.886c.29-.402 3.82.046 4.612-.173l.356.32.03.74zm53.707 37.046v-1.096h1.852c.453-4.265.203-8.549 0-12.814-.029-.302-.222-.494-.444-.676-.366-.32-1.61-.457-1.408-.859l3.81-1.863c.81.146.135 3.388.116 4.046-.116 3.873.106 7.754 0 11.627l.376.52 1.708.028v1.096h-6.02zM71.42 88.445c-.666.2-.184 2.128 0 2.63.685 1.845 2.344 2.53 4.341 2.147 1.322-.256 1.312-1.398 2.48-1.48.067 1.854-2.5 3.334-4.274 3.297-6.946-.164-6.6-12.056 1.553-10.476 2.142.411 3.145 3.9 2.132 3.9H71.4Zm-.116-.877h4.052c.694 0 .395-2.43-1.582-2.347-1.187.055-2.325 1.26-2.47 2.347zm-6.02 33.977H67.6v-13.043c0-.666-2.527-.877-1.852-1.635l3.936-1.543v15.892l1.862.42.222.996c-1.66-.22-4.129.292-5.673 0-.434-.082-.55-.384-.81-.658.039-.073 0-.301 0-.438zm46.066-13.043c-.116-.63-2.065-.886-1.852-1.315.086-.164 3.183-1.772 3.405-1.827.386-.091.57-.027.733.33l-.202 15.307.376.52 1.708.028v1.096h-5.905l-.347-.329.222-.657 1.862-.1V108.51zm-81.25 7.782c-.646 2.941 2.142 6.448 5.316 4.485.589-.366 1.216-1.708 1.862-.859-1.418 3.964-7.284 3.955-8.837.037-1.553-3.919 1.013-8.504 5.895-7.554 1.997.393 3.473 3.9 2.363 3.9H30.1zm.232-.877h4.052c.637 0 .067-1.717-.637-2.027-1.582-.704-3.26.484-3.415 2.027zm94.669.877c-.8 3.864 3.618 7.197 6.28 3.316l.897.3c-.665 1.764-2.276 2.97-4.283 2.97-7.226.018-6.56-12.011 1.331-10.495 2.026.393 3.396 3.9 2.364 3.9h-6.599zm.231-.877h4.052c.637 0 .068-1.717-.636-2.027-1.534-.676-3.358.493-3.416 2.027zm-59.948 6.576c-.579 1.224-3.704 1.151-3.82-.657-1.891 1.854-6.088 2.612-5.422-1.197.386-2.21 4.12-2.493 5.084-3.516.492-.52.106-2.804-.463-3.078-.424-.201-2.547-.165-2.75.146.068 1.324-.057 2.895-1.9 2.512-1.572-3.398 6.608-5.608 7.178-2.192.222 1.315-.444 6.704.472 7.233l1.621-.337c0 .219.01.438 0 .657 0 .137.039.365 0 .439zm-3.936-4.375c-1.669.274-3.608 1.343-3.232 3.17.3 1.443 2.672.657 3.116-.329.338-.767 0-2 .116-2.84zm40.683-5.215c6.83-1.105 8.817 8.129 2.604 10.138-7.63 2.457-9.946-8.941-2.604-10.138zm-.01.877c-3.04.667-3.194 7.846.28 8.631 5.16 1.17 5.16-9.818-.28-8.631zm60.884-.877c7.843-1.187 8.403 10.074 1.09 10.476-6.888.375-7.612-9.48-1.09-10.476zm-1.013 8.86c.328.283 1.051.62 1.486.685 4.669.758 4.92-9.17-.058-8.732-3.252.283-3.473 6.302-1.428 8.047zm10.332-5.955c-.212-.932-1.707-.758-1.37-1.517.077-.164 2.49-1.443 2.653-1.452.772-.018.57 1.069.579 1.544 1.534-1.462 4.611-2.411 6.251-.548.203.228.927 1.58.927 1.753v6.467l1.398.1.222.658-.347.329h-4.63c-.203 0-.425-.493-.348-.767.164-.567 1.428.027 1.62-.877.146-.722.078-5.864-.173-6.412-.82-1.817-4.688-.703-4.688.493v6.467h1.389v1.096h-4.862v-1.096h1.389v-6.247zm-157.627 13.7.096-.895 1.534-.302.212-12.284c-.221-1.105-1.939-.968-1.601-1.745.164-.374 3.164-1.708 3.454-1.443-.357 2.284 1.389.265 2.48.046 7.534-1.452 7.65 10.659-.29 10.485-.656-.018-1.283-.32-1.959-.228v5.26l1.63.101.223.996h-5.789Zm6.396-15.481c-.753.018-2.2.675-2.421 1.397-.184.603-.164 4.86-.058 5.663.115.95 1.813 1.416 2.682 1.416 4.476-.028 3.907-8.586-.203-8.476zm20.916-36.032v8.11c.55.037.752-.493 1.225-.703 1.9-.831 4.602-.585 5.46 1.489.155.365.483 1.854.483 2.174v5.15l1.398.101c.85 1.68-1.88.768-2.653.768-.771 0-1.958.675-2.672-.1-.173-1.133 1.168-.567 1.63-.86.329-.2.29-4.566.213-5.27-.232-2.182-2.036-3.516-4.158-2.192-.232.147-.936.914-.936 1.087v6.467l1.515.21v.676c-.762.584-1.814-.018-2.567-.018-.627 0-2.884.74-2.884-.32s1.679.1 1.862-1.306c.482-3.681-.376-8.284-.02-12.057-.163-.849-.935-.876-1.553-1.169-.164-.073-.453-.009-.29-.374.204-.448 3.242-1.918 3.937-1.863zm-30.322 28.067.232 4.384-.714-.128c-.608-4.649-8.538-4.576-6.744.512.955 2.703 7.844 1.644 8.384 6.302.579 4.923-3.492 7.727-8.268 5.635-.386-.164-1.032-.895-1.34-.867-.242.018-.666.858-1.265.603l.463-4.823h.927c-.155 2.75 2.132 5.142 5.16 4.558 2.181-.43 3.001-2.676 2.065-4.494-1.389-2.685-7.225-2.119-8.22-6.02-.993-3.9 2.123-6.283 5.953-5.854.666.073 1.785.64 2.113.621.386-.009.753-.575 1.274-.429zm82.86.22.696 5.48-.898-.028c-2.112-6.804-11.47-6.549-12.271 1.041-.733 6.933 5.972 12.285 12.223 7.188.579-.475.936-1.717 1.64-.858.174.612-2.566 2.904-3.251 3.27-4.611 2.447-10.863.62-12.667-4.202-2.672-7.17 2.885-14.065 11.008-11.956.492.128 2.334.95 2.46.923.376-.082.415-1.005 1.06-.859zM.243 94.581v-.876c1.36.11 1.89-.119 2.518-1.233 1.572-2.777 3.618-8.467 4.66-11.59.289-.868.56-1.535.492-2.494l2.392-1.352.405.283 5.451 15.217c.685 1.114 1.524 1.278 2.827 1.16v.877h-7.178v-.877c.589-.019 1.573.219 1.63-.548.097-1.233-1.398-3.571-1.504-4.942-.328-.42-5.316-.228-6.165-.082l-1.785 4.996c.415.85 1.457.54 2.267.576v.877H.232zm6.02-7.452h5.325l-2.43-7.015c-.425-.128-.657.822-.753 1.041-.29.649-2.383 5.764-2.142 5.974Zm102.078-3.508h5.557v.877c-3.097-.484-3.792 3.398-5.76 4.96 1.216 1.982 4.245 5.17 6.811 3.15.55-.428.627-1.26 1.496-1.095.135 1.434-1.949 3.041-3.28 3.352-3.194.758-4.747-1.315-6.58-3.352-2.315 1.909-3.82 3.964-7.332 3.443-6.705-.995-4.602-8.357.521-10.028l-2.084-1.864c-1.591-2.091 2.075-5.608 4.226-5.325 1.428.183 3.058 1.818 3.135 3.197.087 1.498-1.563 2.457-2.489 3.453 1.756 1.26 3.425 2.584 4.747 4.274.434.091 2.904-3.251 2.334-3.964l-1.06-.32-.232-.767zm-7.467-4.767c-.907.228-1.872 1.79-1.746 2.64.135.958 2.093 2.785 3.097 2.146 2.112-1.343 1.128-5.398-1.351-4.786zm-.482 6.558c-7.786 4.52.607 12.184 5.364 5.15-.406-1.022-4.535-5.27-5.364-5.15z" style="stroke-width:.938692"></path>
                        </g>
                      </svg>
                    </template>
                    
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
            <li id="footer-login"></li>
          </ul>
        </div>
      </footer>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("custom-links")) {
        e.target.style.textDecoration = "underline";
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("custom-links")) {
        e.target.style.textDecoration = "none";
      }
    });
  }
  // Handles slot fallback, attribute wiring, and dynamic content.
  connectedCallback() {
    console.log("\u{1F4E6} FooterGlobal connected");
    this.hoursUrl = "https://libcal.caltech.edu/api_hours_today.php?lid=0&format=json&systemTime=0";
    const slot1 = this.shadowRoot.querySelector('slot[name="custom-links"]');
    if (!slot1) {
      console.warn("\u26A0\uFE0F slot[name='custom-links'] not found");
      return;
    }
    const assignedNodes = slot1.assignedNodes({
      flatten: true
    });
    if (assignedNodes.length === 0) {
      this.loadDefaultColumn1();
    }
    console.log("\u{1F9EA} type attribute is:", this.getAttribute("type"));
    if (this.getAttribute("type") === "libguides") {
      console.log("\u{1F9EA} Detected type=libguides");
      const sourceWrapper = document.getElementById("s-lib-footer-login-link");
      if (!sourceWrapper) {
        console.warn("\u274C s-lib-footer-login-link not found");
        return;
      }
      const sourceLink = sourceWrapper.querySelector("a");
      if (!sourceLink) {
        console.warn("\u{1F6AB} Login <a> not found inside s-lib-footer-login-link");
        return;
      }
      console.log("\u2705 Login link found:", sourceLink.href);
      const login_link = document.createElement("a");
      login_link.setAttribute("href", sourceLink.href);
      login_link.setAttribute("aria-label", "Staff Login");
      login_link.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false" class="svg-inline--fa fa-sign-in fa-w-16">
          <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
        </svg>
      `;
      const shadowTarget = this.shadowRoot?.getElementById("footer-login");
      if (!shadowTarget) {
        console.warn("\u26A0\uFE0F Could not find #footer-login inside shadow DOM");
        return;
      }
      console.log("\u{1F680} Injecting login link into shadow DOM");
      shadowTarget.appendChild(login_link);
    }
    slot1.addEventListener("slotchange", () => {
      const hasContent = slot1.assignedNodes().length > 0;
      const fallback = this.shadowRoot.querySelector("#default-column1");
      fallback.style.display = hasContent ? "none" : "block";
      fallback.setAttribute("aria-hidden", hasContent ? "true" : "false");
      if (!hasContent) {
        this.loadDefaultColumn1();
      }
    });
    const email = this.getAttribute("email") || "library@caltech.edu";
    const phone = this.getAttribute("phone") || "626-395-3405";
    const emailLink = this.shadowRoot.getElementById("email-link");
    const phoneLink = this.shadowRoot.getElementById("phone-link");
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      emailLink.textContent = email;
    }
    if (phoneLink) {
      phoneLink.href = `tel:${phone.replace(/\D/g, "")}`;
      phoneLink.textContent = phone;
    }
    const headerText = this.getAttribute("header") || "Hours";
    const headerEl = this.shadowRoot.getElementById("column1-header");
    if (headerEl) {
      headerEl.textContent = headerText;
    }
    const instagramAnchor = this.shadowRoot.getElementById("instagram-link");
    const youtubeAnchor = this.shadowRoot.getElementById("youtube-link");
    const instagramHref = this.getAttribute("instagram") || "https://www.instagram.com/caltechlibrary/";
    const youtubeHref = this.getAttribute("twitter") || "https://www.youtube.com/channel/UCQbC4mcNNqypGMRtjgcN0SA";
    if (instagramAnchor) instagramAnchor.setAttribute("href", instagramHref);
    if (youtubeAnchor) youtubeAnchor.setAttribute("href", youtubeHref);
    const logoType = (this.getAttribute("logo") || "library").toLowerCase();
    const logoContainer = this.shadowRoot.querySelector(".footer-logo-container");
    if (logoContainer) {
      const templateId = logoType === "archives" ? "archives-logo" : "library-logo";
      const logoTemplate = this.shadowRoot.getElementById(templateId);
      console.log("Logo type:", logoType);
      console.log("Template ID:", templateId);
      console.log("Logo template found:", !!logoTemplate);
      if (logoTemplate) {
        logoContainer.innerHTML = "";
        logoContainer.appendChild(logoTemplate.content.cloneNode(true));
      }
    }
  }
  // If no Slot, load column1 default content - Library Hours
  async loadDefaultColumn1() {
    const container = this.shadowRoot.querySelector("#default-column1");
    try {
      const response = await fetch(this.hoursUrl);
      const data = await response.json();
      const locations = data.locations;
      const column1Content = document.createElement("div");
      column1Content.id = "column1";
      column1Content.classList.add("column1-default");
      const rows = locations.map((loc) => {
        const name = loc.name;
        const url = loc.url;
        const hours = loc.rendered || "\u2014";
        return `
            <div class="hours-row">
              <a class="lib-link" href="${url}" target="_blank" rel="noopener">${name}</a>
              <span class="lib-hours">${hours}</span>
            </div>`;
      }).join("");
      const todayString = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      column1Content.innerHTML = `
        <div class="library-hours">
          <div class="today">${todayString}</div>
          ${rows}
          <div class="hours-footer">
            <a class="view-all" href="https://library.caltech.edu/locations">View All Hours</a>
            <span class="footnote">* Caltech ID Required</span>
          </div>
        </div>
      `;
      const slot1 = this.shadowRoot.querySelector('slot[name="custom-links"]');
      if (slot1 && slot1.parentNode) {
        slot1.parentNode.insertBefore(column1Content, slot1);
      } else {
        container.appendChild(column1Content);
      }
    } catch (error) {
      console.error("Error loading library hours:", error);
      container.innerHTML = `<p>Unable to load library hours at this time.</p>`;
    }
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

        /* ------------------------- 
           Base Styles
        ------------------------- */
        :host {
          font-family: 'Hind', sans-serif;
          display: block;
          background-color: #062e47;
          color: #fff;
          border-radius: 0 30% 0 0 / 5%;
        }

        @media (min-width: 768px) {
          :host {
            border-radius: 0 30% 0 0 / 10%;
           }
        }

        @media (min-width: 992px) {
          :host {
            border-radius: 0 30% 0 0 / 20%;
          }
        }
        
        /* -------------------------
           Layout & Structure
        ------------------------- */

        .footer-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 1150px;
          margin: auto;
        }

        .footer-column {
          padding: 1rem 0;
        }

        .footer-column.column1 {
          flex: 0 1 40%;
          margin-right: 7.6rem;
        }

        .footer-column.column2 {
          flex: 0 1 21%;
          margin-right: 3.6rem;
        }

        .footer-column.column3 {
          flex: 0 1 21%;
        }

        :host([custom]) .footer-column.column1 {
          flex: 0 1 30%;
          margin-right: 3rem;
        }

        /* Adjust column layout if 'custom' attribute is present */

        :host([custom]) .footer-column.column2 {
          flex: 0 1 30%;
          margin-right: 3rem;
        }

        :host([custom]) .footer-column.column3 {
          flex: 0 1 30%;
        }

        .footer-bottom {
          flex: 1 1 100%;
          text-align: right;
          margin: 2rem 5rem 0 0;
        }


        /* -------------------------
           Typography
        ------------------------- */

        h2 {
          font-size: 30px;
          margin-block-end: 16px;
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 500;
          line-height: 1.1;
          color: inherit;
        }

        /* -------------------------
           Lists
        ------------------------- */

        ul {
          margin-top: 0;
        }

        .list-unstyled {
          padding-left: 0;
          list-style: none;
        }

        .list-inline {
          padding-left: 0;
          list-style: none;
          margin-left: -5px;
        }

        .list-inline > li {
          display: inline-block;
          padding-right: 5px;
          padding-left: 5px;
        }

        .list-inline a {
          text-decoration: none;
        }


        /* -------------------------
           Links
        ------------------------- */

        a {
          color: white;
          text-decoration: none;
          display: block;
          line-height: 2;
        }

        a:hover {
          text-decoration: underline;
        }

        ::slotted(.custom-links) {
          color: white;
          text-decoration: none;
          display: block;
          line-height: 2;
        }


        /* -------------------------
           Responsive Styles
        ------------------------- */

        @media (max-width: 1024px) {
          .footer-container {
            flex-direction: column;
            align-items: stretch;
            margin: 0 4rem 0 1rem;
          }

          .footer-column {
            flex: 0 0 100%;
            width: 100%;
          }

          .footer-bottom {
            flex: 0 0 100%;
            text-align: left;
            padding: 1rem 0;
            border-top: grey dotted 1px;
          }
        }

        /* -------------------------
           Contact Us
        ------------------------- */

        address {
          margin-bottom: 24px;
          font-style: normal;
          line-height: 1.5;
          unicode-bidi: isolate;
        }


        /* -------------------------
           Social & Branding
        ------------------------- */

        .logo-library {
          fill: #fff;
          margin: 24px 0px 16px 0px;
          height: 5em;
        }

         .logo-archives {
          fill: #fff;
          margin: 24px 0px 16px 0px;
          height: 5em;
        }
        </style>

        <footer class="footer-container" role="contentinfo">
            <div class="footer-column column1">
                <div class="custom-links-wrapper">
                    <h2 id="column1-header">Quick Links</h2>
                    <slot name="custom-links">
                        <a href="/" aria-label="Home">Home</a>
                        <a href="#" id="back-to-top" aria-label="Back to top of page">Back to Top</a>
                    </slot>
                </div>
            </div>

            <div class="footer-column column2">
                <h2>Contact Us</h2>
                <address>
                    <a class="p-name" href="https://library.caltech.edu/">Caltech Library</a>
                    <a id="email-link" class="u-email" href="mailto:library@caltech.edu">library@caltech.edu</a>
                    <a id="phone-link" class="p-tel" href="tel:6263953405">626-395-3405</a>
                </address>
            </div>

            <div class="footer-column column3">
                <section class="links">
                    <div class="footer-logo-container"></div>
                    <!-- Library Logo SVG Template -->
                    <template id="library-logo">
                      <!-- Begin Caltech Library Logo SVG -->
                      <svg class="logo-library" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190">
                        <path d="M72.52,26.4C68.66,9.47,56.28,1,40,1,15.83,1,1.67,20.6,1.67,43.44S14.12,85.94,40,85.94c16.13,0,26.93-7.84,33.4-24.09L59.57,55.49c-3,9.43-9,16.36-19.54,16.36-16.14,0-22.84-14.32-22.84-28.41S23.89,15,40,15c9.2,0,16.59,6.13,17.84,15.11L72.52,26.4Zm54.25,17.5C126.77,27.54,114.38,25,102,25c-12.61,0-24.54,5.22-24.54,18.74l13.86.57c0-6.25,2.61-8.63,10.68-8.63,6,0,10.91,1.59,10.91,7.27v1.7c-3.52,1.25-10,2.39-15,3.41l-5.8,1.14c-8.52,1.7-17.49,6.7-17.49,17.95s8.63,18.07,19.54,18.07a29.07,29.07,0,0,0,18.75-6.59,10.85,10.85,0,0,0,1.36,5.22h14.66c-.8-1.25-2.16-3.75-2.16-9.66V43.9ZM112.91,63.33c0,7.38-8.3,10.56-14.77,10.56-5,0-9-2.84-9-7.15,0-5.46,4.32-6.94,9.54-8l7.62-1.59a24.8,24.8,0,0,0,6.59-2v8.19Zm23.78,20.56h13.86V.72H136.69V83.89Zm23.23-70V70.71c0,8.75,3.86,13.86,15.22,13.86a51.43,51.43,0,0,0,11-1.36V71.85a59.08,59.08,0,0,1-6.14.68c-5.34,0-6.25-2.5-6.25-7V36.4h12.39v-10H173.78V0L159.92,13.88Zm84,44.56c0-20.57-8.4-33.4-27.61-33.4-18.63,0-29.43,13-29.43,30.1s10.8,30.12,29.43,30.12c15.68,0,24-7.5,28.3-14.09L232.9,64.35c-1.36,1.93-5.68,8.18-16.59,8.18-7.5,0-14.65-5.57-14.88-14.09ZM201.43,47.76A14.79,14.79,0,0,1,216.31,36.4c9.32,0,13.07,8.29,13.07,11.36ZM302.29,41.4C298.77,32.76,292,25,278,25c-18.63,0-29.43,13-29.43,30.1S259.34,85.26,277,85.26c15.57,0,22.16-9.21,26-17.62l-11.82-6.25c-2.15,5.23-5.68,11.14-14,11.14-9.66,0-14.09-8.41-14.09-17.39s5-17.38,14.88-17.38A12.78,12.78,0,0,1,290.13,47l12.16-5.56Zm4.32,42.49h13.86V54.35c0-7,3.18-15.91,13.63-15.91,7,0,10.23,3.41,10.23,11.36V83.89h13.86V45.83c0-16.71-11.25-20.79-21-20.79-7.84,0-13.41,3.06-16.47,7h-.23V.72H306.61V83.89Z"></path>
                        <path d="M16.1,129.71c0-5.34-.17-14.19-.25-15.69-.17-2.17-.58-3-3.09-3H8.84c-.5,0-.58-.41-.58-.83v-1.84c0-.41.08-.58.58-.58.92,0,3.92.25,10.85.25,8.09,0,11.6-.25,12.35-.25s.75.25.75.67v1.92c0,.41-.17.66-.83.66H27c-2.59,0-2.92.84-2.92,3.26,0,1.08-.25,13.68-.25,19.53V141c0,1.42,0,19.45.25,22.87,1.84.16,18.36.33,20.94,0,4.93-.75,9.93-10.77,11.1-14,.17-.34.34-.5.67-.34l1.34.5c.25.17.25.26.16.76-.25.58-3.59,14.35-4.09,16.6-1.08-.08-7.59-.16-15-.16s-15.6-.09-20.11-.09c-3.25,0-5.67.09-7.42.09s-2.67.16-3.26.16-.67-.16-.67-.58v-2.09c0-.42.09-.58.59-.58h4c3.09,0,3.59-1.17,3.59-2.26,0-1.58.25-22.36.25-27.45Z"></path>
                        <path d="M68.18,142.81c0-2.84-.5-4.34-4.67-5-.59-.08-.75-.25-.75-.58v-.75c0-.25.16-.42.58-.59a67.1,67.1,0,0,0,9-4.09,3.51,3.51,0,0,1,1.59-.5c.42,0,.5.42.42,1-.17,1.42-.17,6.68-.17,13.61V155c0,3.26,0,6.26.08,7.18.17,1.58.42,2.17,1.34,2.17h3.84c.66,0,.83.25.83.75v1.42c0,.58-.17.83-.75.83s-4.51-.25-8-.25c-4.84,0-8.1.25-9,.25-.42,0-.67-.16-.67-.67V165c0-.5.25-.66.83-.66h4.09c.92,0,1.25-.34,1.34-1.67.08-2.5.08-5.09.08-7.6Zm-3.92-25.62a4.92,4.92,0,0,1,5.26-4.67,4.39,4.39,0,0,1,4.5,4.42,4.78,4.78,0,0,1-5,4.92C67.1,121.86,64.26,119.94,64.26,117.19Z"></path>
                        <path d="M88,122.11c0-5.59-.92-6.76-3.92-7.76l-.84-.25c-.92-.25-1.08-.42-1.08-.67v-.66c0-.25.16-.42.67-.67a90.64,90.64,0,0,0,8.84-4.59,3.45,3.45,0,0,1,1.75-.75c.59,0,.76.42.67,1.42-.08.66-.08,10.18-.08,17.6v9.68c2.67-2.58,7.42-4.17,11.51-4.17,7.35,0,15.27,5.93,15.27,17.86,0,9.76-7.84,18.94-17.35,18.94-4.68,0-7.93-1-9.85-2.17l-3.34,1.84a1.2,1.2,0,0,1-1.08.25l-1-.25c-.34-.08-.42-.25-.34-.67.17-1.17.17-8.09.17-14.18Zm6,27c0,6.93.25,9.43,1.25,12.1.83,2,4.34,4.17,7.93,4.17,5,0,11.18-3.42,11.18-14.35,0-8.1-4.26-15.77-12.43-15.77a11.09,11.09,0,0,0-7.93,3Z"></path>
                        <path d="M132.11,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.91-.75h3.26c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                        <path d="M183.43,163.42a3.85,3.85,0,0,0,2.92-1.25c.34-.42.5-.59.83-.34l.84.67c.25.25.42.67-.08,1.5a6.89,6.89,0,0,1-6.51,4.09c-3,0-5.18-2.17-5.93-5.59h-.16a18,18,0,0,1-8.27,5.09,15.65,15.65,0,0,1-4.92.5c-2,0-5-1.67-5-6.92,0-3.84,1.76-7.18,8.35-10.1,3.75-1.67,8.09-3.67,9.43-4.84v-5.34c-.17-1.42-.25-3.59-1.17-4.67s-2.59-1.84-5-1.84a9.37,9.37,0,0,0-5.42,1.75c-1.17,1.09-.42,2.34-.42,3.84,0,2.92-1,4.76-4.42,4.76-1.34,0-2-.75-2-2.67,0-2.67,2.33-5.84,5.75-7.85a18.49,18.49,0,0,1,10.19-2.92c3.92,0,5.5,1.17,6.67,2.26,1.75,1.75,1.84,3.67,1.84,5.92v17.69C180.93,161.92,181.93,163.42,183.43,163.42Zm-8.59-14.69c-3,2.26-11.19,3.92-11.19,10.85,0,3.09,1.84,4.59,4.34,4.59s6.85-2.92,6.85-5.17Z"></path>
                        <path d="M196.62,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.92-.75h3.25c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                        <path d="M219.82,185.53c0-1.75,1.84-3.25,3.84-3.25a14.25,14.25,0,0,1,3.84.92,2,2,0,0,0,1.75-.5c1.25-1.51,5.51-11,6.68-14.27-.42-2.09-9.27-28.21-9.93-30-1-2.09-1.76-3.51-3.93-3.51H219.9c-.58,0-.67-.25-.67-.75v-1.67c0-.33.09-.58.67-.58.75,0,2.76.25,7.68.25,4.26,0,6.84-.25,7.76-.25.67,0,.75.25.75.58v1.76c0,.41-.08.66-.5.66H234c-.92,0-1.26.59-1.09,1.84.25,1.84,5.93,20.28,6.84,22.11h.34c.83-1.33,8.09-18.69,8.59-20.78s-.16-3.17-1.41-3.17h-1.34c-.5,0-.59-.25-.59-.66v-1.67c0-.42.09-.67.51-.67,1.08,0,2.83.25,6.84.25,2.25,0,4.17-.25,5.09-.25.5,0,.5.33.5.67v1.58c0,.5,0,.75-.42.75h-1.33a3.73,3.73,0,0,0-2.92,1.51c-1.84,2.25-7.35,15-13.11,28.12-4.08,9.26-7.34,17-8.84,19.77-1.17,2.18-2.67,5.43-7.09,5.43C221.41,189.79,219.82,188,219.82,185.53Z"></path>
                    </svg>
                      <!-- End Caltech Library Logo SVG -->
                    </template>
                    <!-- Archives Logo SVG Template -->
                    <template id="archives-logo">
                      <svg class="logo-archives" xmlns="http://www.w3.org/2000/svg" width="210.808" height="128.998" viewBox="0 0 210.8076 128.99799" role="img">
                        <g transform="translate(-64.798, 0)">
                        <path d="M79.798 49.33V.61l.36-.36h7.67l.36.36v49.08h-8.03zm22.07-33.72h7.2v6h-7.2v18.6c0 .14.47 1.37.6 1.56 1.23 1.73 4.83.87 6.6.72v6.72c-5.53 1.21-14.32 2.07-15.33-5.43l-.02-35.49 8.15-8.29v15.6zm75.81 9.11-7.04 2.91c-2.27-5.94-9.63-7.21-13.71-2.18-4.08 5.03-2.68 16.51 4.8 17.28 5.21.54 7.44-2.21 9.59-6.45l6.74 3.57.11.35c-3.43 8.05-10.61 11.5-19.2 9.86-16.3-3.11-17.57-28.79-2.27-34.21 5.95-2.11 13.54-1.48 18 3.36.64.7 3.55 4.85 2.98 5.51zM75.238 49.69h-8.52l-.96-3.12c-5.21 4.62-15.36 5.71-20.16 0-2.42-2.87-3-6.92-1.81-10.45 2.76-8.19 15.35-7.31 22.05-9.74.67-4.91-4.43-5.64-8.18-5.18-3.05.37-4.59 1.76-4.5 4.97-1.04.02-7.96 0-8.3-.47.04-7.84 7.31-10.89 14.16-11.06 6.85-.17 14.34 1.56 15.02 9.48.55 6.44-.44 13.65 0 20.17.13 1.94.56 3.59 1.2 5.4zm-9.36-17.04c-3.84 2.31-15.84.89-13.75 8.12 1.38 4.78 11.02 3.06 13.14-.93.15-.28.61-1.34.61-1.55zm77.5 1.92h-25.19c.62 6.74 6.48 9.4 12.66 7.75 2.83-.76 4.06-2.44 6.17-4.14l6.59 3.61c.39.56-2.2 3.32-2.76 3.82-4.11 3.73-10.13 5.21-15.6 4.82-22.93-1.66-20.46-39.47 4.98-35.46 10.18 1.6 13.18 10.36 13.14 19.61zm-8.64-6.24c-1.41-9.37-14.59-8.77-16.56 0zM188.488.49v18.24l2.96-2.2c4.58-2.7 13.06-2.37 16.71 1.85 1.03 1.19 2.65 4.48 2.65 5.99v25.32h-8.16V27.73c0-.42-.65-2.24-.91-2.69-2.13-3.64-8.81-2.66-11.19.43-.86 1.12-2.06 4.27-2.06 5.62v18.6h-8.16V.49ZM.138 22.09c.46-4.83 3.21-11.18 6.47-14.77 9.06-9.95 27.86-9.41 33.88 3.57.37.8 1.74 4.12 1.29 4.74l-8.53 2.15c-1.4-10.01-14.43-11.7-20.25-4.3-5.95 7.56-4.92 24.67 5.31 28.25 7.37 2.57 14.02-1.5 15.91-8.82l8.35 3.7c-4.19 11.62-14.63 16.52-26.55 13.4C6.718 47.57.948 38.61.128 29.3c-.16-1.87-.18-5.34 0-7.2z" class="caltech-logotype"></path>
                        <path d="M152.611 107.36c1.274-1.278 3.686.457 2.364 1.91-1.322 1.452-3.704-.567-2.364-1.91zm-101.73-.456c1.36-.11 2.267 1.553 1.003 2.493-2.055 1.544-3.84-2.265-1.003-2.493zm2.537-27.84c2.21-.428 2.547 2.43.82 2.777-2.132.42-2.682-2.41-.82-2.776zm1.91 5.435v8.878l.386.292 1.466.037v.877h-4.978c-.067 0-.328.301-.578.219v-1.096l1.476-.028.347-.328c-.058-1.763.193-3.727.038-5.462-.096-1.096-.212-1.398-1.485-1.416-1.187-.493 2.836-2.01 3.328-1.973zm99.994 27.84v8.877c.435.54 1.216.292 1.853.329v1.096h-5.441c-.232 0-.599-.685-.126-.996l1.63-.1c.049-1.37.734-6.037-.231-6.905-.424-.374-1.505-.137-1.158-.877.087-.192 2.972-1.452 3.473-1.425zm-102.763 0v9.206l1.63.1.223.658-.348.329h-5.44v-1.096h1.851v-6.686c0-.347-2.064-.64-1.62-1.206l3.704-1.315zm-31.479-25.1c-.125-.429-1.505-.867-1.39-1.315l3.233-1.425.241 1.526c1.206-1.115 3.27-2.996 4.4-.759-.32 2.375-1.979.676-3.262 1.07-1.9.593-.926 5.434-1.11 7.005l.348.328 1.708.028-.106.886c-.415.575-2.152-.037-2.788-.037-.888 0-1.91.439-2.895.238v-1.096h1.621c-.318-1.681.434-5.015 0-6.467zm129.853 25.319c0 .429.154 1.114-.376 1.287l-3.078.046c-.174 1.535-.694 6.147.203 7.289.607.776 1.669.146 2.325.027 1.051-.192.733.676 0 1.096-1.525.859-3.734.767-4.563-.913-.666-1.343.366-7.115-.049-7.517h-1.852c-.067-.384-.01-.484.241-.758.888-.968 2.673-1.754 3.116-3.188l.58.128v2.503h3.472zM47.427 114.94c-.125.192-1.11.302-1.418.22-1.196-.32-.733-2.448-3.184-1.836-3.434.867-2.383 7.599.81 8.02.473.063 1.612.054 2.084-.02.782-.127 2.2-1.643 2.103-.2-2.083 2.037-5.778 2.539-7.872.219-3.347-3.717.106-9.974 5.451-8.896 1.023.21 2.73 1.443 2.036 2.503zm90.482-2.548c1.273-.192 2.76-.119 3.772.713 1.602 1.306.135 2.785-1.187 1.771-.83-.639-.79-1.854-2.392-1.653-3.936.484-2.73 7.645.222 8.093.656.1 2.228.09 2.826-.156.251-.1 1.467-1.342 1.68-.383.192.85-3.03 2.018-3.821 2.082-7.062.557-6.985-9.58-1.1-10.476zM33.969 85.66c-1.07-.84-2.71-.045-3.367.96-2.364 3.625 1.698 9.279 6.097 5.99l.579.549c-1.187 1.078-3.039 1.954-4.708 1.854-6.86-.42-5.894-11.664 2.036-10.494 2.402.356 3 3.169.993 2.804-1.07-.201-1.138-1.27-1.62-1.654zm45.902 5.645.887.036c.705 2.028 1.891 3.58 4.226 2.064 1.331-3.863-3.917-1.99-4.891-5.27-1.168-3.927 6.319-5.315 6.637-1.434.164 2.037-1.949-.83-2.21-.995-1.109-.694-2.96-.192-3 1.105-.057 2.1 3.734 1.534 4.892 3.242 2.141 3.17-2.103 6.147-5.451 4.503-1.023-.502-.897-2.292-1.09-3.242Zm111.098 23.884c-1.215.301-1.312-.968-1.92-1.461-1.08-.868-3.135-.612-3.174.922-.058 1.863 1.91 1.626 3.252 2.183 3.907 1.626 1.929 6.32-2.19 6.037-2.653-.182-2.711-1.552-2.663-3.735 1.39-.137 1.273 2.247 2.48 2.585 1.6.447 3.453-.348 2.672-2.092-.782-1.745-5.162-1.032-5.162-4.33 0-3.698 7.226-4.347 6.734-.109zM62.274 85.595l-.936.1-.183.393 2.161 6.074c.482-.84 2.962-6.074 2.422-6.567-.618 0-1.274 0-1.149-.776.203-.603 3.695-.027 4.4-.329v1.096c-.319.01-.685-.046-.994.046-.955.283-3.454 6.667-4.13 7.928-.443.83-.925 2.183-1.755.85-1.38-2.22-1.978-5.892-3.338-8.24-.318-.639-.926-.62-1.582-.584l.106-.886c.29-.402 3.82.046 4.612-.173l.356.32.03.74zm53.707 37.046v-1.096h1.852c.453-4.265.203-8.549 0-12.814-.029-.302-.222-.494-.444-.676-.366-.32-1.61-.457-1.408-.859l3.81-1.863c.81.146.135 3.388.116 4.046-.116 3.873.106 7.754 0 11.627l.376.52 1.708.028v1.096h-6.02zM71.42 88.445c-.666.2-.184 2.128 0 2.63.685 1.845 2.344 2.53 4.341 2.147 1.322-.256 1.312-1.398 2.48-1.48.067 1.854-2.5 3.334-4.274 3.297-6.946-.164-6.6-12.056 1.553-10.476 2.142.411 3.145 3.9 2.132 3.9H71.4Zm-.116-.877h4.052c.694 0 .395-2.43-1.582-2.347-1.187.055-2.325 1.26-2.47 2.347zm-6.02 33.977H67.6v-13.043c0-.666-2.527-.877-1.852-1.635l3.936-1.543v15.892l1.862.42.222.996c-1.66-.22-4.129.292-5.673 0-.434-.082-.55-.384-.81-.658.039-.073 0-.301 0-.438zm46.066-13.043c-.116-.63-2.065-.886-1.852-1.315.086-.164 3.183-1.772 3.405-1.827.386-.091.57-.027.733.33l-.202 15.307.376.52 1.708.028v1.096h-5.905l-.347-.329.222-.657 1.862-.1V108.51zm-81.25 7.782c-.646 2.941 2.142 6.448 5.316 4.485.589-.366 1.216-1.708 1.862-.859-1.418 3.964-7.284 3.955-8.837.037-1.553-3.919 1.013-8.504 5.895-7.554 1.997.393 3.473 3.9 2.363 3.9H30.1zm.232-.877h4.052c.637 0 .067-1.717-.637-2.027-1.582-.704-3.26.484-3.415 2.027zm94.669.877c-.8 3.864 3.618 7.197 6.28 3.316l.897.3c-.665 1.764-2.276 2.97-4.283 2.97-7.226.018-6.56-12.011 1.331-10.495 2.026.393 3.396 3.9 2.364 3.9h-6.599zm.231-.877h4.052c.637 0 .068-1.717-.636-2.027-1.534-.676-3.358.493-3.416 2.027zm-59.948 6.576c-.579 1.224-3.704 1.151-3.82-.657-1.891 1.854-6.088 2.612-5.422-1.197.386-2.21 4.12-2.493 5.084-3.516.492-.52.106-2.804-.463-3.078-.424-.201-2.547-.165-2.75.146.068 1.324-.057 2.895-1.9 2.512-1.572-3.398 6.608-5.608 7.178-2.192.222 1.315-.444 6.704.472 7.233l1.621-.337c0 .219.01.438 0 .657 0 .137.039.365 0 .439zm-3.936-4.375c-1.669.274-3.608 1.343-3.232 3.17.3 1.443 2.672.657 3.116-.329.338-.767 0-2 .116-2.84zm40.683-5.215c6.83-1.105 8.817 8.129 2.604 10.138-7.63 2.457-9.946-8.941-2.604-10.138zm-.01.877c-3.04.667-3.194 7.846.28 8.631 5.16 1.17 5.16-9.818-.28-8.631zm60.884-.877c7.843-1.187 8.403 10.074 1.09 10.476-6.888.375-7.612-9.48-1.09-10.476zm-1.013 8.86c.328.283 1.051.62 1.486.685 4.669.758 4.92-9.17-.058-8.732-3.252.283-3.473 6.302-1.428 8.047zm10.332-5.955c-.212-.932-1.707-.758-1.37-1.517.077-.164 2.49-1.443 2.653-1.452.772-.018.57 1.069.579 1.544 1.534-1.462 4.611-2.411 6.251-.548.203.228.927 1.58.927 1.753v6.467l1.398.1.222.658-.347.329h-4.63c-.203 0-.425-.493-.348-.767.164-.567 1.428.027 1.62-.877.146-.722.078-5.864-.173-6.412-.82-1.817-4.688-.703-4.688.493v6.467h1.389v1.096h-4.862v-1.096h1.389v-6.247zm-157.627 13.7.096-.895 1.534-.302.212-12.284c-.221-1.105-1.939-.968-1.601-1.745.164-.374 3.164-1.708 3.454-1.443-.357 2.284 1.389.265 2.48.046 7.534-1.452 7.65 10.659-.29 10.485-.656-.018-1.283-.32-1.959-.228v5.26l1.63.101.223.996h-5.789Zm6.396-15.481c-.753.018-2.2.675-2.421 1.397-.184.603-.164 4.86-.058 5.663.115.95 1.813 1.416 2.682 1.416 4.476-.028 3.907-8.586-.203-8.476zm20.916-36.032v8.11c.55.037.752-.493 1.225-.703 1.9-.831 4.602-.585 5.46 1.489.155.365.483 1.854.483 2.174v5.15l1.398.101c.85 1.68-1.88.768-2.653.768-.771 0-1.958.675-2.672-.1-.173-1.133 1.168-.567 1.63-.86.329-.2.29-4.566.213-5.27-.232-2.182-2.036-3.516-4.158-2.192-.232.147-.936.914-.936 1.087v6.467l1.515.21v.676c-.762.584-1.814-.018-2.567-.018-.627 0-2.884.74-2.884-.32s1.679.1 1.862-1.306c.482-3.681-.376-8.284-.02-12.057-.163-.849-.935-.876-1.553-1.169-.164-.073-.453-.009-.29-.374.204-.448 3.242-1.918 3.937-1.863zm-30.322 28.067.232 4.384-.714-.128c-.608-4.649-8.538-4.576-6.744.512.955 2.703 7.844 1.644 8.384 6.302.579 4.923-3.492 7.727-8.268 5.635-.386-.164-1.032-.895-1.34-.867-.242.018-.666.858-1.265.603l.463-4.823h.927c-.155 2.75 2.132 5.142 5.16 4.558 2.181-.43 3.001-2.676 2.065-4.494-1.389-2.685-7.225-2.119-8.22-6.02-.993-3.9 2.123-6.283 5.953-5.854.666.073 1.785.64 2.113.621.386-.009.753-.575 1.274-.429zm82.86.22.696 5.48-.898-.028c-2.112-6.804-11.47-6.549-12.271 1.041-.733 6.933 5.972 12.285 12.223 7.188.579-.475.936-1.717 1.64-.858.174.612-2.566 2.904-3.251 3.27-4.611 2.447-10.863.62-12.667-4.202-2.672-7.17 2.885-14.065 11.008-11.956.492.128 2.334.95 2.46.923.376-.082.415-1.005 1.06-.859zM.243 94.581v-.876c1.36.11 1.89-.119 2.518-1.233 1.572-2.777 3.618-8.467 4.66-11.59.289-.868.56-1.535.492-2.494l2.392-1.352.405.283 5.451 15.217c.685 1.114 1.524 1.278 2.827 1.16v.877h-7.178v-.877c.589-.019 1.573.219 1.63-.548.097-1.233-1.398-3.571-1.504-4.942-.328-.42-5.316-.228-6.165-.082l-1.785 4.996c.415.85 1.457.54 2.267.576v.877H.232zm6.02-7.452h5.325l-2.43-7.015c-.425-.128-.657.822-.753 1.041-.29.649-2.383 5.764-2.142 5.974Zm102.078-3.508h5.557v.877c-3.097-.484-3.792 3.398-5.76 4.96 1.216 1.982 4.245 5.17 6.811 3.15.55-.428.627-1.26 1.496-1.095.135 1.434-1.949 3.041-3.28 3.352-3.194.758-4.747-1.315-6.58-3.352-2.315 1.909-3.82 3.964-7.332 3.443-6.705-.995-4.602-8.357.521-10.028l-2.084-1.864c-1.591-2.091 2.075-5.608 4.226-5.325 1.428.183 3.058 1.818 3.135 3.197.087 1.498-1.563 2.457-2.489 3.453 1.756 1.26 3.425 2.584 4.747 4.274.434.091 2.904-3.251 2.334-3.964l-1.06-.32-.232-.767zm-7.467-4.767c-.907.228-1.872 1.79-1.746 2.64.135.958 2.093 2.785 3.097 2.146 2.112-1.343 1.128-5.398-1.351-4.786zm-.482 6.558c-7.786 4.52.607 12.184 5.364 5.15-.406-1.022-4.535-5.27-5.364-5.15z" style="stroke-width:.938692"></path>
                        </g>
                      </svg>
                    </template>
                    
                    <ul class="list-unstyled">
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
            </ul>
            </div>
        </footer>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("custom-links")) {
        e.target.style.textDecoration = "underline";
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("custom-links")) {
        e.target.style.textDecoration = "none";
      }
    });
  }
  // Handles slot fallback, attribute wiring, and dynamic content.
  connectedCallback() {
    this.shadowRoot.querySelector("#back-to-top")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
    const slot1 = this.shadowRoot.querySelector('slot[name="custom-links"]');
    if (!slot1) {
      console.warn("\u26A0\uFE0F slot[name='custom-links'] not found");
      return;
    }
    ;
    const email = this.getAttribute("email") || "library@caltech.edu";
    const phone = this.getAttribute("phone") || "626-395-3405";
    const emailLink = this.shadowRoot.getElementById("email-link");
    const phoneLink = this.shadowRoot.getElementById("phone-link");
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      emailLink.textContent = email;
    }
    if (phoneLink) {
      phoneLink.href = `tel:${phone.replace(/\D/g, "")}`;
      phoneLink.textContent = phone;
    }
    const headerText = this.getAttribute("header") || "Quick Links";
    const headerEl = this.shadowRoot.getElementById("column1-header");
    if (headerEl) {
      headerEl.textContent = headerText;
    }
    const instagramAnchor = this.shadowRoot.getElementById("instagram-link");
    const youtubeAnchor = this.shadowRoot.getElementById("youtube-link");
    const instagramHref = this.getAttribute("instagram") || "https://www.instagram.com/caltechlibrary/";
    const youtubeHref = this.getAttribute("youtube") || "https://www.youtube.com/channel/UCQbC4mcNNqypGMRtjgcN0SA";
    if (instagramAnchor) instagramAnchor.setAttribute("href", instagramHref);
    if (youtubeAnchor) youtubeAnchor.setAttribute("href", youtubeHref);
    const logoType = (this.getAttribute("logo") || "library").toLowerCase();
    const logoContainer = this.shadowRoot.querySelector(".footer-logo-container");
    if (logoContainer) {
      const templateId = logoType === "archives" ? "archives-logo" : "library-logo";
      const logoTemplate = this.shadowRoot.getElementById(templateId);
      console.log("Logo type:", logoType);
      console.log("Template ID:", templateId);
      console.log("Logo template found:", !!logoTemplate);
      if (logoTemplate) {
        logoContainer.innerHTML = "";
        logoContainer.appendChild(logoTemplate.content.cloneNode(true));
      }
    }
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
