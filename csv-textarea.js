/**
 * csv-textarea wraps a textarea providing a table like editable experience.
 */

class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isComponentInitialized = false;
    this.custcomCleanupFilter = undefined;
  }

  static get observedAttributes() {
    return ['column-headings', 'id', 'class', 'caption', 'text', 'placeholder', 'css-href', 'debug'];
  }

  attributeChangedCallback(name, old, newVal) {
    if (name === 'column-headings' && this.isComponentInitialized) {
      this.initializeTable();
    }
  }

  async connectedCallback() {
    await this.initializeComponent();
    this.isComponentInitialized = true;
    this.initializeTable();
    this.setupEventListeners();
    this.setupMutationObserver();
  }

setupMutationObserver() {
  // Select the node that will be observed for mutations
  const targetNode = this.shadowRoot.querySelector('tbody');

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['value'] // This ensures we only observe changes to the 'value' attribute
  };

  // Callback function to execute when mutations are observed
  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
        // If an input value changes, update the textarea
        this.toTextarea();
      } else if (mutation.type === 'childList') {
        // If there are changes in the child list (like adding or removing rows), update the textarea
        this.toTextarea();
      }
    }
  };

  // Create an observer instance linked to the callback function
  this.observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  if (targetNode) {
    this.observer.observe(targetNode, config);
  }
}

  disconnectedCallback() {
    // Disconnect the observer when the element is removed from the DOM
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  async initializeComponent() {
    const template = document.createElement('template');
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
      ${this.hasAttribute('debug') ? '<button id="debug">Debug</button>' : ''}
      ${this.hasAttribute('title') || this.hasAttribute('help-description') ? '<span id="help-icon">ⓘ</span>' : ''}
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (this.hasAttribute('css-href')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.getAttribute('css-href');
      this.shadowRoot.appendChild(link);
    }

    if (this.hasAttribute('title') || this.hasAttribute('help-description')) {
      const helpIcon = this.shadowRoot.getElementById('help-icon');
      helpIcon.addEventListener('click', () => {
        alert(`${this.getAttribute('title') || ''}\n${this.getAttribute('help-description') || ''}`);
      });
    }
  }

  initializeTable() {
    const headings = parseCSVRow(this.getAttribute('column-headings'));
    const table = this.shadowRoot.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear existing headings
    thead.innerHTML = '';

    // Create table headings
    const tr = document.createElement('tr');
    headings.forEach(heading => {
      const th = document.createElement('th');
      th.textContent = heading;
      tr.appendChild(th);
    });
    thead.appendChild(tr);

    // Populate table body
    const textarea = this.querySelector('textarea');
    if (textarea && textarea.value.trim()) {
      this.fromTextarea();
    } else {
      this.appendRow();
    }

    // Clone datalists into the shadow DOM
    const datalists = this.querySelectorAll('datalist');
    datalists.forEach(datalist => {
      this.shadowRoot.appendChild(datalist.cloneNode(true));
    });

    // Associate datalists with columns
    headings.forEach((heading, index) => {
      const datalist = this.shadowRoot.querySelector(`datalist#${heading.toLowerCase()}`);
      if (datalist) {
        this.setAutocomplete(index, Array.from(datalist.options).map(option => ({ value: option.value })));
      }
    });
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('#append-row').addEventListener('click', () => this.appendRow());
    this.shadowRoot.querySelector('#cleanup').addEventListener('click', () => this.cleanupTable());

    if (this.hasAttribute('debug')) {
      this.shadowRoot.querySelector('#debug').addEventListener('click', () => {
        console.log(this.toCSV());
      });
    }

    this.shadowRoot.querySelector('tbody').addEventListener('input', event => {
      if (event.target.tagName === 'INPUT') {
        const rowIndex = event.target.closest('tr').rowIndex - 1;
        const colIndex = event.target.closest('td').cellIndex;
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('changed', { detail: { rowIndex, colIndex, value } }));
        if (this.hasAttribute('debug')) {
          console.log(`Cell changed: Row ${rowIndex}, Col ${colIndex}, Value ${value}`);
        }
      }
    });

    this.shadowRoot.querySelector('tbody').addEventListener('focus', event => {
      if (event.target.tagName === 'INPUT') {
        const rowIndex = event.target.closest('tr').rowIndex - 1;
        const colIndex = event.target.closest('td').cellIndex;
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('focused', { detail: { rowIndex, colIndex, value } }));
        if (this.hasAttribute('debug')) {
          console.log(`Cell focused: Row ${rowIndex}, Col ${colIndex}, Value ${value}`);
        }
      }
    }, true);

    this.shadowRoot.querySelector('tbody').addEventListener('keydown', event => {
      if (event.key === 'Backspace' && event.target.tagName === 'INPUT') {
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
    return this.shadowRoot.querySelector('tbody').rows.length;
  }

  columnCount() {
    return this.shadowRoot.querySelector('thead').rows[0].cells.length;
  }

  isEmptyRow(rowIndex) {
    const row = this.shadowRoot.querySelector(`tbody tr:nth-child(${rowIndex + 1})`);
    return Array.from(row.cells).every(cell => cell.querySelector('input').value === '');
  }

  appendRow() {
    const tbody = this.shadowRoot.querySelector('tbody');
    const row = document.createElement('tr');
    for (let i = 0; i < this.columnCount(); i++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = this.getAttribute('placeholder') || '';
      const datalistId = `column-${i}`;
      const datalist = this.shadowRoot.querySelector(`datalist#${datalistId}`);
      if (datalist) {
        input.setAttribute('list', datalistId);
      }
      td.appendChild(input);
      row.appendChild(td);
    }
    tbody.appendChild(row);
    row.cells[0].querySelector('input').focus();
  }

  cleanupTable() {
    const tbody = this.shadowRoot.querySelector('tbody');
    const rows = tbody.rows;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (this.isEmptyRow(i)) {
        tbody.deleteRow(i);
      }
      if ((this.customCleanupFilter !== undefined) &&
          (this.customCleanupFilter(rows[i]) === false)) {
        tbody.deleteRow(i);
      }
    }
  }

  toCSV() {
    const rows = [];
    const tbody = this.shadowRoot.querySelector('tbody').rows;
    console.log(this.innertHTML);//DEBUG
    for (let i = 0; i < tbody.length; i++) {
      const cells = tbody[i].cells;
      const row = [];
      for (let j = 0; j < cells.length; j++) {
        row.push(cells[j].querySelector('input').value);
      }
      rows.push(row);
    }
    return stringifyCSV(rows);
  }

  fromCSV(csvText) {
    const rows = parseCSV(csvText);
    const tbody = this.shadowRoot.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell;
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  toObjects() {
    const objects = [];
    const tbody = this.shadowRoot.querySelector('tbody').rows;
    for (let i = 0; i < tbody.length; i++) {
      const cells = tbody[i].cells;
      for (let j = 0; j < cells.length; j++) {
        objects.push({ rowIndex: i, colIndex: j, value: cells[j].querySelector('input').value });
      }
    }
    return objects;
  }

  fromObjects(objects) {
    const tbody = this.shadowRoot.querySelector('tbody');
    tbody.innerHTML = '';
    objects.forEach(obj => {
      let row = tbody.rows[obj.rowIndex];
      if (!row) {
        row = document.createElement('tr');
        tbody.appendChild(row);
      }
      let cell = row.cells[obj.colIndex];
      if (!cell) {
        cell = document.createElement('td');
        row.appendChild(cell);
      }
      let input = cell.querySelector('input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'text';
        cell.appendChild(input);
      }
      input.value = obj.value;
    });
  }


  fromTextarea() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      this.fromCSV(textarea.value.trim());
    }
  }

  toTextarea() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.value = this.toCSV(); // Convert the current state of the component to CSV and update the textarea
      console.log('Textarea updated with CSV data:', textarea.value);
    }
  }

  setupFormListener() {
    const form = this.closest('form');
    if (form) {
      form.addEventListener('submit', (event) => {
        this.toTextarea(); // Update the textarea with the latest CSV data
      });
    }
  }

  getCellValue(rowIndex, colIndexOrName) {
    const colIndex = typeof colIndexOrName === 'number' ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const cell = this.shadowRoot.querySelector(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1}) input`);
    return cell ? cell.value : '';
  }

  setCellValue(rowIndex, colIndexOrName, value) {
    const colIndex = typeof colIndexOrName === 'number' ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
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
    const colIndex = typeof colIndexOrName === 'number' ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const datalistId = `column-${colIndex}`;
    let datalist = this.shadowRoot.querySelector(`datalist#${datalistId}`);
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = datalistId;
      this.shadowRoot.appendChild(datalist);
    }
    datalist.innerHTML = '';
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      datalist.appendChild(opt);
    });
    const inputs = this.shadowRoot.querySelectorAll(`tbody td:nth-child(${colIndex + 1}) input`);
    inputs.forEach(input => input.setAttribute('list', datalistId));
  }

  getAutocomplete(colIndexOrName) {
    const colIndex = typeof colIndexOrName === 'number' ? colIndexOrName : this.getColumnIndexByName(colIndexOrName);
    const datalist = this.shadowRoot.querySelector(`datalist#column-${colIndex}`);
    if (datalist) {
      const options = [];
      datalist.querySelectorAll('option').forEach(option => {
        options.push({ value: option.value });
      });
      return options;
    }
    return undefined;
  }

  getColumnIndexByName(colName) {
    const headings = parseCSVRow(this.getAttribute('column-headings'));
    return headings.indexOf(colName);
  }
}

customElements.define('csv-textarea', CSVTextarea);

export { CSVTextarea };


/**
 * Parses a CSV string that represents an array of columns.
 * @param {string} csvRowString - The CSV data as a string.
 * @returns {string[]} - An array of columns.
 */
export function parseCSVRow(csvRowString) {
  let currentColumn = '';
  let inQuotes = false;
  const columns = [];
  const row = csvRowString.split('');

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      columns.push(currentColumn.trim());
      currentColumn = '';
    } else {
      currentColumn += char;
    }
  }
  columns.push(currentColumn.trim());
  return columns;
}

/**
 * Parses a CSV string and returns a 2D array of rows and columns.
 * @param {string} csvString - The CSV data as a string.
 * @returns {string[][]} - A 2D array of rows and columns.
 */
export function parseCSV(csvString) {
  const rows = csvString.trim().split('\n');
  const maxColumns = 0;

  const data = rows.map(parseCSVRow);
  
  const maxColumnCount = Math.max(...data.map((row) => row.length));

  return data.map((row) => {
    while (row.length < maxColumnCount) {
      row.push('');
    }
    return row;
  });
}

/**
 * stringifyCSVRow takes an array of strings and returns a CSV encoded string.
 */
export function stringifyCSVRow(array) {
  return array.map(field => {
      // Check if the field contains a comma, newline, or double quote
      if (/[",\n]/.test(field)) {
          // Escape double quotes and enclose the field in double quotes
          return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
  }).join(',');
}

/**
 * stringifyCSV a 2D array of strings (rows and columns) and returns a CSV encoded string.
 */
export function stringifyCSV(data) {
  return data.map(stringifyCSVRow).join('\n');
}

