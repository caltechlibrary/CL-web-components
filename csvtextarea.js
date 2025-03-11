// csv-textarea.js
import { parseCSV, parseCSVRow, stringifyCSV } from './parseCSV.js';

class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.helpVisible = false;
  }

  static get observedAttributes() {
    return ['column-headings', 'id', 'class', 'caption', 'text', 'placeholder', 'css-href', 'debug'];
  }

  attributeChangedCallback(name, old, newVal) {
    if (name === 'column-headings') {
      this.initializeComponent();
    }
  }

  connectedCallback() {
    this.initializeComponent();
  }

  initializeComponent() {
    const columnHeadings = this.getAttribute('column-headings');
    if (!columnHeadings) {
      throw new Error('The "column-headings" attribute is required.');
    }

    this.headings = parseCSVRow(columnHeadings);
    this.render();
    this.initializeTable();
    this.setupAutocomplete();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.defaultCSS}
        ${this.customCSS}
        .help-icon {
          cursor: pointer;
          margin-left: 10px;
          font-size: 1.2em;
        }
        .help-description {
          display: none;
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
        }
        .autocomplete-list {
          position: absolute;
          border: 1px solid #d4d4d4;
          border-bottom: none;
          border-top: none;
          z-index: 99;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          max-height: 150px;
          overflow-y: auto;
        }
        .autocomplete-list div {
          padding: 10px;
          cursor: pointer;
          background-color: #fff;
          border-bottom: 1px solid #d4d4d4;
        }
        .autocomplete-list div:hover {
          background-color: #e9e9e9;
        }
      </style>
      <table ${this.getAttribute('id') ? `id="${this.getAttribute('id')}"` : ''} ${this.getAttribute('class') ? `class="${this.getAttribute('class')}"` : ''}>
        <caption>${this.getAttribute('caption') || ''}</caption>
        <thead>
          <tr>${this.headings.map(heading => `<th>${heading}</th>`).join('')}</tr>
        </thead>
        <tbody></tbody>
      </table>
      <div>
        <button id="append-row">Append Row</button>
        <button id="cleanup">Cleanup</button>
        ${this.debug ? '<button id="debug-btn">Debug</button>' : ''}
        <span class="help-icon" title="display help">ⓘ</span>
      </div>
      <div class="help-description">
        <h4>Help Description</h4>
        <p>${this.getAttribute('caption') || 'CSV Editor'}</p>
        <p>Keybinds:
          <ul>
            <li><strong>Backspace</strong>: Delete character or selected text.</li>
            <li><strong>Tab</strong>: Move to the next cell.</li>
            <li><strong>Shift+Tab</strong>: Move to the previous cell.</li>
          </ul>
        </p>
      </div>
    `;

    this.table = this.shadowRoot.querySelector('table');
    this.tbody = this.table.querySelector('tbody');

    this.shadowRoot.querySelector('#append-row').addEventListener('click', () => this.appendRow());
    this.shadowRoot.querySelector('#cleanup').addEventListener('click', () => this.cleanupTable());

    if (this.debug) {
      this.shadowRoot.querySelector('#debug-btn').addEventListener('click', () => this.debugTable());
    }

    this.shadowRoot.querySelector('.help-icon').addEventListener('click', () => this.toggleHelp());
  }

  initializeTable() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      this.fromTextarea(textarea.value);
    }

    // If the table body is empty after initialization, add one empty row
    if (this.tbody.rows.length === 0) {
      this.appendRow();
    }

    this.tbody.addEventListener('input', event => {
      if (event.target.tagName === 'TD') {
        const rowIndex = event.target.parentNode.rowIndex - 1;
        const colIndex = event.target.cellIndex;
        const value = event.target.innerText; // Changed to innerText
        this.dispatchEvent(new CustomEvent('cell-change', { detail: { rowIndex, colIndex, value } }));
        if (this.debug) {
          console.log(`Cell changed: Row ${rowIndex}, Col ${colIndex}, Value: ${value}`);
        }
        this.handleAutocomplete(event.target, rowIndex, colIndex);
      }
    });

    this.tbody.addEventListener('focusin', event => {
      if (event.target.tagName === 'TD') {
        const rowIndex = event.target.parentNode.rowIndex - 1;
        const colIndex = event.target.cellIndex;
        const value = event.target.innerText; // Changed to innerText
        this.dispatchEvent(new CustomEvent('cell-focus', { detail: { rowIndex, colIndex, value } }));
        if (this.debug) {
          console.log(`Cell focused: Row ${rowIndex}, Col ${colIndex}, Value: ${value}`);
        }
      }
    });

    this.tbody.addEventListener('keydown', event => {
      if (event.key === 'Backspace' && event.target.tagName === 'TD') {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          event.preventDefault();

          // Dispatch cell-change event after deletion
          const rowIndex = event.target.parentNode.rowIndex - 1;
          const colIndex = event.target.cellIndex;
          const value = event.target.innerText;
          this.dispatchEvent(new CustomEvent('cell-change', { detail: { rowIndex, colIndex, value } }));
          if (this.debug) {
            console.log(`Cell changed (backspace): Row ${rowIndex}, Col ${colIndex}, Value: ${value}`);
          }
        } else {
          // Allow default backspace behavior
          const rowIndex = event.target.parentNode.rowIndex - 1;
          const colIndex = event.target.cellIndex;
          const value = event.target.innerText;
          this.dispatchEvent(new CustomEvent('cell-change', { detail: { rowIndex, colIndex, value } }));
          if (this.debug) {
            console.log(`Cell changed (backspace default): Row ${rowIndex}, Col ${colIndex}, Value: ${value}`);
          }
        }
      }
    });
  }

  setupAutocomplete() {
    this.autocompleteLists = {};
    this.headings.forEach((heading, index) => {
      const datalist = this.querySelector(`datalist#${heading}`);
      if (datalist) {
        this.autocompleteLists[index] = Array.from(datalist.querySelectorAll('option')).map(option => option.value);
      }
    });
  }

  handleAutocomplete(cell, rowIndex, colIndex) {
    const autocompleteList = this.autocompleteLists[colIndex];
    if (!autocompleteList) return;

    const value = cell.innerText;
    const suggestions = autocompleteList.filter(item => item.toLowerCase().includes(value.toLowerCase()));

    // Remove any existing autocomplete list
    const existingList = cell.querySelector('.autocomplete-list');
    if (existingList) {
      existingList.remove();
    }

    if (suggestions.length > 0) {
      const div = document.createElement('div');
      div.className = 'autocomplete-list';
      suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.innerText = suggestion;
        item.addEventListener('click', () => {
          cell.innerText = suggestion;
          this.dispatchEvent(new CustomEvent('cell-change', { detail: { rowIndex, colIndex, value: suggestion } }));
          div.remove();
        });
        div.appendChild(item);
      });
      cell.appendChild(div);
    }
  }

  get defaultCSS() {
    return `
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f2f2f2;
      }
      td {
        cursor: text;
        position: relative;
      }
      td[contenteditable="true"] {
        outline: none;
      }
      button {
        margin-top: 10px;
      }
    `;
  }

  get customCSS() {
    const cssHref = this.getAttribute('css-href');
    return cssHref ? `@import url('${cssHref}');` : '';
  }

  get debug() {
    return this.getAttribute('debug') === 'true';
  }

  rowCount() {
    return this.tbody.rows.length;
  }

  columnCount() {
    return this.headings.length;
  }

  isEmptyRow(rowIndex) {
    const row = this.tbody.rows[rowIndex];
    return Array.from(row.cells).every(cell => {
      const content = cell.innerHTML.replace(/<br>|&nbsp;/g, '').trim();
      return content === '';
    });
  }

  appendRow() {
    const row = this.tbody.insertRow();
    this.headings.forEach(() => {
      const cell = row.insertCell();
      cell.contentEditable = true;
    });
    row.cells[0].focus();
    if (this.debug) {
      console.log('Row appended');
    }
  }

  cleanupTable() {
    // Iterate over the rows in reverse order to avoid index issues when deleting rows
    for (let index = this.tbody.rows.length - 1; index >= 0; index--) {
      if (this.isEmptyRow(index)) {
        this.tbody.deleteRow(index);
      }
    }
    if (this.debug) {
      console.log('Table cleaned up');
    }
  }

  toCSV() {
    const rows = Array.from(this.tbody.rows).map(row =>
      Array.from(row.cells).map(cell => {
        let content = cell.innerHTML;
        // Convert HTML entities to UTF-8 characters
        const textArea = document.createElement('textarea');
        textArea.innerHTML = content;
        content = textArea.value;
        // Replace <br> with escaped newline
        content = content.replace(/<br>/g, '\\n');
        // Remove <div> and replace </div> with newline
        content = content.replace(/<div>/g, '').replace(/<\/div>/g, '\n');
        // Remove <span> and </span>
        content = content.replace(/<\/?span>/g, '');
        return content;
      })
    );
    return stringifyCSV(rows);
  }

  toJSON() {
    const objects = this.toObjects();
    return JSON.stringify(objects, null, 2);
  }

  fromJSON(jsonString) {
    const objects = JSON.parse(jsonString);
    this.fromObjects(objects);
  }

  fromCSV(csv) {
    const rows = parseCSV(csv);
    this.tbody.innerHTML = '';
    rows.forEach(row => {
      const tr = this.tbody.insertRow();
      row.forEach(cell => {
        const td = tr.insertCell();
        td.contentEditable = true;
        td.innerHTML = cell;
      });
    });
  }

  fromTextarea(text) {
    if (text.trim() === '') {
      return;
    }
    this.fromCSV(text);
  }

  toObjects() {
    return Array.from(this.tbody.rows).map((row, rowIndex) =>
      Array.from(row.cells).map((cell, colIndex) => ({
        rowIndex,
        colIndex,
        value: cell.innerHTML
      }))
    ).flat();
  }

  fromObjects(objects) {
    this.tbody.innerHTML = '';
    objects.forEach(obj => {
      const row = this.tbody.rows[obj.rowIndex] || this.tbody.insertRow();
      row.cells[obj.colIndex] = row.cells[obj.colIndex] || row.insertCell();
      row.cells[obj.colIndex].contentEditable = true;
      row.cells[obj.colIndex].innerHTML = obj.value;
    });
  }

  setCellValue(rowIndex, colIndex, value) {
    if (typeof colIndex !== 'number') {
      colIndex = this.headings.indexOf(colIndex);
      if (colIndex === -1) {
        console.error(`Column heading "${colIndex}" not found.`);
        return;
      }
    }
    const row = this.tbody.rows[rowIndex];
    if (row) {
      const cell = row.cells[colIndex];
      if (cell) {
        cell.innerHTML = value;
        this.dispatchEvent(new CustomEvent('cell-change', { detail: { rowIndex, colIndex, value } }));
        if (this.debug) {
          console.log(`Cell updated: Row ${rowIndex}, Col ${colIndex}, Value: ${value}`);
        }
      }
    }
  }

  getCellValue(rowIndex, colIndex) {
    if (typeof colIndex !== 'number') {
      colIndex = this.headings.indexOf(colIndex);
      if (colIndex === -1) {
        console.error(`Column heading "${colIndex}" not found.`);
        return '';
      }
    }
    const row = this.tbody.rows[rowIndex];
    if (row) {
      const cell = row.cells[colIndex];
      if (cell) {
        return cell.innerText;
      }
    }
    return '';
  }

  toggleHelp() {
    this.helpVisible = !this.helpVisible;
    const helpDescription = this.shadowRoot.querySelector('.help-description');
    helpDescription.style.display = this.helpVisible ? 'block' : 'none';
  }

  toTextarea() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.value = this.toCSV();
    }
  }

  debugTable() {
    console.log(this.toCSV());
    this.toTextarea();
  }
}

customElements.define('csv-textarea', CSVTextarea);
