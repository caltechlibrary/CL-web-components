// csvtextarea.js

import { parseCSV } from './parseCSV.js';

class Cell {
  constructor(rowIndex = 0, colIndex = 0, value = '') {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.value = value;
  }

  toCSV() {
    return JSON.stringify(this.value);
  }

  toJSON() {
    return JSON.stringify({
      rowIndex: this.rowIndex,
      colIndex: this.colIndex,
      value: this.value,
    });
  }

  fromJSON(json) {
    const obj = JSON.parse(json);
    this.rowIndex = obj.rowIndex ?? 0;
    this.colIndex = obj.colIndex ?? 0;
    this.value = obj.value ?? '';
  }

  isEmpty() {
    return this.value === '';
  }
}

class Table {
  constructor(columnHeadings = [], rowCount = 0) {
    this.columnHeadings = columnHeadings;
    this.rowCount = rowCount;
    this.columnCount = columnHeadings.length;
    this.data = Array.from({ length: rowCount }, () =>
      Array.from({ length: this.columnCount }, () => new Cell())
    );
    this.currentRow = 0;
    this.currentColumn = 0;
  }

  getCurrentCell() {
    return { currentRow: this.currentRow, currentColumn: this.currentColumn };
  }

  setCurrentCell(rowIndex, colIndex) {
    if (rowIndex >= 0 && rowIndex < this.rowCount && colIndex >= 0 && colIndex < this.columnCount) {
      this.currentRow = rowIndex;
      this.currentColumn = colIndex;
      return true;
    }
    return false;
  }

  updateCell(rowIndex, colIndex, value) {
    if (typeof colIndex === 'string') {
      colIndex = this.columnHeadings.indexOf(colIndex);
      if (colIndex === -1) return false;
    }
    if (this.setCurrentCell(rowIndex, colIndex)) {
      this.data[rowIndex][colIndex].value = value;
      return true;
    }
    return false;
  }

  getRow(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.rowCount) {
      this.setCurrentCell(rowIndex, 0);
      return this.data[rowIndex];
    }
    return null;
  }

  setRow(rowIndex, cells) {
    if (rowIndex >= 0 && rowIndex < this.rowCount && cells.length === this.columnCount) {
      this.data[rowIndex] = cells;
      this.setCurrentCell(rowIndex, 0);
      return true;
    }
    return false;
  }

  isEmptyRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= this.rowCount) {
      throw new Error('Row index out of range');
    }
    return this.data[rowIndex].every(cell => cell.isEmpty());
  }

  isEmpty() {
    return this.data.every((_, rowIndex) => this.isEmptyRow(rowIndex));
  }

  insertRow() {
    const newRow = Array.from({ length: this.columnCount }, () => new Cell());
    this.data.push(newRow);
    this.rowCount++;
    this.setCurrentCell(this.rowCount - 1, 0);
  }

  cleanUpTable() {
    this.data = this.data.filter((_, rowIndex) => !this.isEmptyRow(rowIndex));
    this.rowCount = this.data.length;
  }

  toCSV() {
    const csvRows = this.data.map(row =>
      row.map(cell => `"${cell.value.replace(/"/g, '""')}"`).join(',')
    );
    return [this.columnHeadings.join(','), ...csvRows].join('\n');
  }

  fromCSV(csv) {
    const parsedData = parseCSV(csv);
    this.columnHeadings = parsedData[0];
    this.columnCount = this.columnHeadings.length;
    this.data = parsedData.slice(1).map(row =>
      row.map((value, colIndex) => new Cell(0, colIndex, value))
    );
    this.rowCount = this.data.length;
  }

  toObjects() {
    return this.data.flat();
  }

  fromObjects(cells) {
    this.data = [];
    for (let i = 0; i < cells.length; i += this.columnCount) {
      const row = cells.slice(i, i + this.columnCount);
      this.data.push(row);
    }
    this.rowCount = this.data.length;
  }
}

class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.table = new Table();
    this.debug = false;
  }

  static get observedAttributes() {
    return ['column-headings', 'caption', 'debug'];
  }

  attributeChangedCallback(name, old, newVal) {
    switch (name) {
      case 'column-headings':
        this.table.columnHeadings = parseCSV(newVal)[0];
        this.table.columnCount = this.table.columnHeadings.length;
        this.render();
        break;
      case 'caption':
        this.render();
        break;
      case 'debug':
        this.debug = newVal !== null;
        break;
    }
  }

  connectedCallback() {
    this.render();
    const textarea = this.querySelector('textarea');
    if (textarea) {
      this.table.fromCSV(textarea.innerText);
      if (this.debug) {
        console.log(this.table.toCSV());
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        button { margin-top: 10px; }
      </style>
      <table>
        <caption>${this.getAttribute('caption') || ''}</caption>
        <thead>
          <tr>${this.table.columnHeadings.map(heading => `<th>${heading}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${this.table.data.map((row, rowIndex) => `
            <tr>${row.map((cell, colIndex) => `
              <td contenteditable="true" data-row="${rowIndex}" data-col="${colIndex}">${cell.value}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
      <button id="append-row">Append Row</button>
      <button id="cleanup">Cleanup</button>
      ${this.debug ? '<button id="debug-btn">Debug</button>' : ''}
    `;

    this.shadowRoot.querySelectorAll('td').forEach(td => {
      td.addEventListener('input', this.handleCellChange.bind(this));
      td.addEventListener('focus', this.handleCellFocus.bind(this));
    });

    this.shadowRoot.querySelector('#append-row').addEventListener('click', this.handleAppendRow.bind(this));
    this.shadowRoot.querySelector('#cleanup').addEventListener('click', this.handleCleanup.bind(this));

    if (this.debug) {
      this.shadowRoot.querySelector('#debug-btn').addEventListener('click', this.handleDebug.bind(this));
    }
  }

  handleCellChange(event) {
    const td = event.target;
    const rowIndex = parseInt(td.dataset.row, 10);
    const colIndex = parseInt(td.dataset.col, 10);
    const newValue = td.innerText;
    this.table.updateCell(rowIndex, colIndex, newValue);
    if (this.debug) {
      console.log(this.table.getRow(rowIndex).map(cell => cell.toCSV()).join(','));
    }
    this.dispatchEvent(new CustomEvent('cell-change', {
      detail: {
        rowIndex,
        colIndex,
        columnName: this.table.columnHeadings[colIndex],
        columnType: 'string',
        cellValue: newValue,
      },
    }));
  }

  handleCellFocus(event) {
    const td = event.target;
    const rowIndex = parseInt(td.dataset.row, 10);
    const colIndex = parseInt(td.dataset.col, 10);
    this.table.setCurrentCell(rowIndex, colIndex);
    if (this.debug) {
      console.log({
        rowIndex,
        colIndex,
        columnName: this.table.columnHeadings[colIndex],
        value: td.innerText,
      });
    }
    this.dispatchEvent(new CustomEvent('cell-focus', {
      detail: {
        rowIndex,
        colIndex,
        columnName: this.table.columnHeadings[colIndex],
        value: td.innerText,
      },
    }));
  }

  handleAppendRow() {
    this.table.insertRow();
    this.render();
  }

  handleCleanup() {
    this.table.cleanUpTable();
    this.render();
  }

  handleDebug() {
    const { currentRow, currentColumn } = this.table.getCurrentCell();
    console.log({ currentRow, currentColumn });
    console.log(this.table.toCSV());
  }
}

customElements.define('csv-textarea', CSVTextarea);

export { CSVTextarea, Table, Cell };
