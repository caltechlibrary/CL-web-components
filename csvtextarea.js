// csvtextarea.js
class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initializeTable();
    this.populateTableFromCSV();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
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
          cursor: pointer;
        }
        caption {
          caption-side: top;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .actions {
          margin-top: 10px;
        }
        button {
          margin-right: 5px;
        }
      </style>
      <table id="csv-table">
        ${this.hasCaption() ? `<caption>${this.getAttribute('caption')}</caption>` : ''}
        <thead id="csv-header"></thead>
        <tbody id="csv-body"></tbody>
      </table>
      <div class="actions">
        <button id="insert-row-btn">Insert Row</button>
        <button id="cleanup-btn">Cleanup</button>
        ${this.getAttribute('debug') === 'true' ? '<button id="debug-btn">Debug</button>' : ''}
      </div>
    `;
  }

  hasCaption() {
    const caption = this.getAttribute('caption');
    return caption !== null && caption.trim() !== '';
  }

  initializeTable() {
    const columnHeadings = this.getAttribute('column-headings');
    if (!columnHeadings) {
      throw new Error('column-headings attribute is required');
    }

    const headers = this.parseCSVRow(columnHeadings);
    const rows = parseInt(this.getAttribute('rows')) || 1;
    const cols = headers.length;
    const maxRows = parseInt(this.getAttribute('max-rows')) || Number.MAX_SAFE_INTEGER;

    this.createTable(headers, rows, cols, maxRows);
  }

  parseCSVRow(csvRow) {
    const rows = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < csvRow.length; i++) {
      const char = csvRow[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        rows.push(cell.trim());
        cell = '';
      } else if (i === csvRow.length - 1) {
        cell += char;
        rows.push(cell.trim());
      } else {
        cell += char;
      }
    }

    return rows;
  }

  createTable(headers, rows, cols, maxRows) {
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    this.shadowRoot.querySelector('#csv-header').appendChild(headerRow);

    const tbody = this.shadowRoot.querySelector('#csv-body');
    for (let i = 0; i < Math.min(rows, maxRows); i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.contentEditable = true;
        td.addEventListener('blur', this.handleCellChange.bind(this, i, j, headers[j]));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  populateTableFromCSV() {
    const textarea = this.querySelector('textarea');
    if (!textarea) return;

    const csvContent = textarea.value.trim();
    if (!csvContent) return;

    const rows = csvContent.split('\n');
    const tbody = this.shadowRoot.querySelector('#csv-body');
    tbody.innerHTML = ''; // Clear existing rows

    rows.forEach((row, rowIndex) => {
      const cols = this.parseCSVRow(row);
      const tr = document.createElement('tr');
      cols.forEach((col, colIndex) => {
        const td = document.createElement('td');
        td.contentEditable = true;
        td.textContent = col.replace(/^"|"$/g, ''); // Unquote the cell value
        td.addEventListener('blur', this.handleCellChange.bind(this, rowIndex, colIndex, this.getAttribute('column-headings').split(',')[colIndex]));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('#insert-row-btn').addEventListener('click', this.insertRow.bind(this));
    this.shadowRoot.querySelector('#cleanup-btn').addEventListener('click', this.cleanupCSV.bind(this));

    if (this.getAttribute('debug') === 'true') {
      this.shadowRoot.querySelector('#debug-btn').addEventListener('click', this.logDebugInfo.bind(this));
    }
  }

  insertRow() {
    const tbody = this.shadowRoot.querySelector('#csv-body');
    const headers = this.getAttribute('column-headings').split(',');
    const newRow = document.createElement('tr');

    // Create a new row with empty cells
    const emptyCells = Array(headers.length).fill('');
    const newCSVRow = emptyCells.join(',');

    // Add the new row to the CSV content
    const textarea = this.querySelector('textarea');
    const csvContent = textarea.value.trim();
    textarea.value = csvContent ? `${csvContent}\n${newCSVRow}` : newCSVRow;

    // Add the new row to the table
    headers.forEach((_, colIndex) => {
      const td = document.createElement('td');
      td.contentEditable = true;
      td.addEventListener('blur', this.handleCellChange.bind(this, tbody.rows.length, colIndex, headers[colIndex]));
      newRow.appendChild(td);
    });

    tbody.appendChild(newRow);
    newRow.cells[0].focus();
  }

  cleanupCSV() {
    const textarea = this.querySelector('textarea');
    const csvContent = textarea.value;

    // Log CSV content before cleanup
    console.log('CSV Content Before Cleanup:', csvContent);

    const rows = csvContent.split('\n');
    const cleanedRows = rows.filter(row => this.parseCSVRow(row).some(cell => cell.trim() !== ''));
    textarea.value = cleanedRows.join('\n');

    // Log CSV content after cleanup
    console.log('CSV Content After Cleanup:', textarea.value);

    this.populateTableFromCSV();
  }

  handleCellChange(row, col, heading, event) {
    const textarea = this.querySelector('textarea');
    const rows = textarea.value.split('\n');
    const debug = this.getAttribute('debug') === 'true';

    if (debug) {
      // Log the cell, row, and CSV content before the change
      console.log(`Before Change - Cell (${row}, ${col}):`, rows[row].split(',')[col]);
      console.log(`Before Change - Row ${row}:`, rows[row]);
      console.log('Before Change - CSV Content:', textarea.value);
    }

    const newValue = event.target.textContent;
    this.updateCSVContent(row, col, newValue);

    if (debug) {
      // Log the cell, row, and CSV content after the change
      console.log(`After Change - Cell (${row}, ${col}):`, newValue);
      console.log(`After Change - Row ${row}:`, textarea.value.split('\n')[row]);
      console.log('After Change - CSV Content:', textarea.value);
    }

    // Dispatch a custom event with details of the change, including the full cell value
    const changeEvent = new CustomEvent('cell-changed', {
      detail: {
        row: row,
        col: col,
        heading: heading,
        value: newValue.includes(',') || newValue.includes('"') ? `"${newValue.replace(/"/g, '""')}"` : newValue
      },
      bubbles: true,
      composed: true // Allow the event to escape the shadow DOM
    });
    this.dispatchEvent(changeEvent);
  }

  logDebugInfo() {
    const textarea = this.querySelector('textarea');
    const rows = textarea.value.split('\n');
    const tbody = this.shadowRoot.querySelector('#csv-body');
    const focusedCell = document.activeElement;

    if (focusedCell && focusedCell.tagName === 'TD') {
      const rowIndex = focusedCell.parentNode.rowIndex - 1; // Adjust for thead
      const colIndex = Array.from(focusedCell.parentNode.children).indexOf(focusedCell);

      // Log the current state of the focused cell, row, and CSV content
      console.log(`Focused Cell (${rowIndex}, ${colIndex}):`, focusedCell.textContent);
      console.log(`Row ${rowIndex}:`, rows[rowIndex]);
      console.log('CSV Content:', textarea.value);
    } else {
      console.log('No cell is currently focused.');
    }
  }

  updateCSVContent(row, col, value) {
    const textarea = this.querySelector('textarea');
    const rows = textarea.value.split('\n');
    if (rows.length <= row) {
      rows.push(','.repeat(col));
    }

    // Parse the existing row to handle quoted values correctly
    let cols = this.parseCSVRow(rows[row]);
    cols[col] = value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;

    // Ensure the number of columns remains consistent
    while (cols.length < this.getAttribute('column-headings').split(',').length) {
      cols.push('');
    }

    // Reconstruct the row with proper quoting
    rows[row] = cols.map(cell => cell.includes(',') || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell).join(',');
    textarea.value = rows.join('\n');
  }

  submitCSVContent(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Cleanup CSV before submission
    this.cleanupCSV();

    const textarea = this.querySelector('textarea');
    const form = this.closest('form');
    if (form) {
      const formData = new FormData(form);
      // Append the CSV content from the specific instance
      formData.append('csv-content', textarea.value);

      // Log form data for demonstration purposes
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Here you would typically submit the formData using fetch or XMLHttpRequest
      // Example:
      // fetch(form.action, {
      //   method: form.method,
      //   body: formData
      // });
    }
  }
}

customElements.define('csv-textarea', CSVTextarea);

// Add an event listener for the custom 'cell-changed' event
document.querySelector('csv-textarea').addEventListener('cell-changed', (event) => {
  console.log('Cell changed:', event.detail);
});
