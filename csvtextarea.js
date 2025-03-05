class CSVTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Initialize columnHeadings and csvData as arrays
    this.columnHeadings = [];
    this.csvData = [];
    this.selectedCells = [];
  }

  connectedCallback() {
    this.parseCsvData();
    this.render();
    this.attachEventListeners();
  }

  // Method to parse CSV data from the inner textarea
  parseCsvData() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      const csvString = textarea.value.trim();
      const rows = csvString.split('\n');
      if (rows.length > 0) {
        this.columnHeadings = this.parseCsvRow(rows[0]);
        this.csvData = rows.slice(1).map(row => this.parseCsvRow(row));
      }
    }
  }

  // Helper method to parse a CSV row into an array
  parseCsvRow(row) {
    return row.split(',').map(cell => cell.trim());
  }

  render() {
    const tableHead = this.renderTableHead();
    const tableBody = this.renderTableBody();
    this.shadowRoot.innerHTML = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        td {
          padding: 5px;
        }
        input[type="text"] {
          width: 100%;
          border: none;
          padding: 5px;
        }
        .controls {
          margin-top: 10px;
        }
        button {
          margin-right: 5px;
        }
        .selected {
          background-color: lightblue;
        }
      </style>
      <table>
        ${tableHead}
        ${tableBody}
      </table>
      <div class="controls">
        <button id="insert-row">Insert Row</button>
        <button id="cleanup">Cleanup</button>
      </div>
    `;
  }

  attachEventListeners() {
    // Insert Row button event listener
    const insertRowButton = this.shadowRoot.querySelector('#insert-row');
    insertRowButton.addEventListener('click', () => {
      this.csvData.push(Array(this.columnHeadings.length).fill(''));
      this.render();
      this.attachEventListeners();

      // Focus on the first cell of the new row
      const newRowIndex = this.csvData.length - 1;
      const firstCellInput = this.shadowRoot.querySelector(`input[data-row="${newRowIndex}"][data-col="0"]`);
      if (firstCellInput) {
        firstCellInput.focus();
      }

      // Update the textarea content
      this.updateTextarea();
    });

    // Cleanup button event listener
    const cleanupButton = this.shadowRoot.querySelector('#cleanup');
    cleanupButton.addEventListener('click', () => {
      this.cleanupTable();
      this.updateTextarea();
    });

    // Add event listeners to input fields for cell changes
    const inputFields = this.shadowRoot.querySelectorAll('input[type="text"]');
    inputFields.forEach(input => {
      const rowIndex = input.getAttribute('data-row');
      const colIndex = input.getAttribute('data-col');

      input.addEventListener('input', (event) => {
        this.csvData[rowIndex][colIndex] = input.value;

        // Dispatch custom event with row and column details
        const cellChangeEvent = new CustomEvent('cell-change', {
          detail: { row: rowIndex, col: colIndex, value: input.value },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(cellChangeEvent);

        this.updateTextarea();
      });

      input.addEventListener('focus', () => {
        this.selectedCells = [{ row: rowIndex, col: colIndex }];
        this.updateSelectedCells();
      });

      input.addEventListener('keydown', event => this.handleKeyDown(event, rowIndex, colIndex));
    });

    // Mouse events for cell selection
    inputFields.forEach(input => {
      input.addEventListener('mousedown', event => {
        const rowIndex = input.getAttribute('data-row');
        const colIndex = input.getAttribute('data-col');
        if (event.shiftKey) {
          this.extendSelection(event, rowIndex, colIndex);
        } else {
          this.selectedCells = [{ row: rowIndex, col: colIndex }];
          this.updateSelectedCells();
        }
      });
    });
  }

  handleKeyDown(event, rowIndex, colIndex) {
    const { key, ctrlKey, shiftKey } = event;

    if (ctrlKey && shiftKey && key === ' ') {
      this.selectAll();
      event.preventDefault();
    } else if (ctrlKey && key === 'a') {
      this.selectAll();
      event.preventDefault();
    } else if (shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.extendSelectionByArrowKey(key, rowIndex, colIndex);
      event.preventDefault();
    } else if (ctrlKey && shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.extendSelectionToEdge(key);
      event.preventDefault();
    } else if (ctrlKey && key === ' ') {
      this.selectColumn(colIndex);
      event.preventDefault();
    } else if (shiftKey && key === ' ') {
      this.selectRow(rowIndex);
      event.preventDefault();
    } else if (ctrlKey && key === 'c') {
      this.copySelection();
      event.preventDefault();
    } else if (ctrlKey && key === 'v') {
      this.pasteSelection(rowIndex, colIndex);
      event.preventDefault();
    } else if (shiftKey && key === 'PageDown') {
      this.selectToEndOfColumn(rowIndex, colIndex);
      event.preventDefault();
    } else if (shiftKey && key === 'PageUp') {
      this.selectToStartOfColumn(rowIndex, colIndex);
      event.preventDefault();
    } else if (shiftKey && key === 'End') {
      this.selectToEndOfRow(rowIndex);
      event.preventDefault();
    } else if (shiftKey && key === 'Home') {
      this.selectToStartOfRow(rowIndex);
      event.preventDefault();
    } else if (ctrlKey && key === 'Home') {
      this.moveToFirstCell();
      event.preventDefault();
    } else if (ctrlKey && key === 'End') {
      this.moveToLastCell();
      event.preventDefault();
    } else if (ctrlKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.moveToEdge(key);
      event.preventDefault();
    } else if (ctrlKey && key === 'Backspace') {
      this.clearCell(rowIndex, colIndex);
      event.preventDefault();
    } else if (ctrlKey && key === 'Insert') {
      this.insertRowBelow(rowIndex);
      event.preventDefault();
    }
  }

  selectAll() {
    this.selectedCells = this.csvData.flatMap((row, rowIndex) =>
      row.map((_, colIndex) => ({ row: rowIndex, col: colIndex }))
    );
    this.updateSelectedCells();
  }

  extendSelectionByArrowKey(key, rowIndex, colIndex) {
    const directions = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 }
    };
    const { row, col } = directions[key];
    const newRowIndex = rowIndex + row;
    const newColIndex = colIndex + col;
    if (this.isValidCell(newRowIndex, newColIndex)) {
      this.selectedCells.push({ row: newRowIndex, col: newColIndex });
      this.updateSelectedCells();
    }
  }

  extendSelectionToEdge(key) {
    if (this.selectedCells.length === 0) return;
    const { row: startRow, col: startCol } = this.selectedCells[0];
    let endRow = startRow, endCol = startCol;

    if (key === 'ArrowUp') endRow = 0;
    else if (key === 'ArrowDown') endRow = this.csvData.length - 1;
    else if (key === 'ArrowLeft') endCol = 0;
    else if (key === 'ArrowRight') endCol = this.columnHeadings.length - 1;

    this.selectedCells = this.csvData.slice(Math.min(startRow, endRow), Math.max(startRow, endRow) + 1)
      .flatMap((_, rowIndex) =>
        this.columnHeadings.slice(Math.min(startCol, endCol), Math.max(startCol, endCol) + 1)
          .map((_, colIndex) => ({ row: rowIndex, col: colIndex }))
      );
    this.updateSelectedCells();
  }

  selectColumn(colIndex) {
    this.selectedCells = this.csvData.map((_, rowIndex) => ({ row: rowIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  selectRow(rowIndex) {
    this.selectedCells = this.columnHeadings.map((_, colIndex) => ({ row: rowIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  copySelection() {
    if (this.selectedCells.length === 0) return;
    const selectedData = this.selectedCells.map(({ row, col }) => this.csvData[row][col]);
    const csvContent = selectedData.join(',');
    navigator.clipboard.writeText(csvContent);
  }

  pasteSelection(rowIndex, colIndex) {
    navigator.clipboard.readText().then(clipText => {
      const pastedData = clipText.split(',');
      pastedData.forEach((data, index) => {
        const newRowIndex = rowIndex + Math.floor(index / this.columnHeadings.length);
        const newColIndex = (colIndex + index) % this.columnHeadings.length;
        if (this.isValidCell(newRowIndex, newColIndex)) {
          this.csvData[newRowIndex][newColIndex] = data.trim();
        }
      });
      this.render();
      this.updateTextarea();
    });
  }

  selectToEndOfColumn(rowIndex, colIndex) {
    this.selectedCells = this.csvData.slice(rowIndex).map((_, rIndex) => ({ row: rIndex + rowIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  selectToStartOfColumn(rowIndex, colIndex) {
    this.selectedCells = this.csvData.slice(0, rowIndex + 1).map((_, rIndex) => ({ row: rIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  selectToEndOfRow(rowIndex) {
    this.selectedCells = this.columnHeadings.map((_, colIndex) => ({ row: rowIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  selectToStartOfRow(rowIndex) {
    this.selectedCells = this.columnHeadings.slice(0, rowIndex + 1).map((_, colIndex) => ({ row: rowIndex, col: colIndex }));
    this.updateSelectedCells();
  }

  moveToFirstCell() {
    this.selectedCells = [{ row: 0, col: 0 }];
    this.updateSelectedCells();
    this.focusCell(0, 0);
  }

  moveToLastCell() {
    const lastRow = this.csvData.length - 1;
    const lastCol = this.columnHeadings.length - 1;
    this.selectedCells = [{ row: lastRow, col: lastCol }];
    this.updateSelectedCells();
    this.focusCell(lastRow, lastCol);
  }

  moveToEdge(key) {
    if (this.selectedCells.length === 0) return;
    const { row: startRow, col: startCol } = this.selectedCells[0];
    let endRow = startRow, endCol = startCol;

    if (key === 'ArrowUp') endRow = 0;
    else if (key === 'ArrowDown') endRow = this.csvData.length - 1;
    else if (key === 'ArrowLeft') endCol = 0;
    else if (key === 'ArrowRight') endCol = this.columnHeadings.length - 1;

    this.selectedCells = [{ row: endRow, col: endCol }];
    this.updateSelectedCells();
    this.focusCell(endRow, endCol);
  }

  clearCell(rowIndex, colIndex) {
    this.csvData[rowIndex][colIndex] = '';
    this.render();
    this.updateTextarea();
  }

  insertRowBelow(rowIndex) {
    this.csvData.splice(rowIndex + 1, 0, Array(this.columnHeadings.length).fill(''));
    this.render();
    this.updateTextarea();
  }

  isValidCell(rowIndex, colIndex) {
    return rowIndex >= 0 && rowIndex < this.csvData.length && colIndex >= 0 && colIndex < this.columnHeadings.length;
  }

  updateSelectedCells() {
    this.shadowRoot.querySelectorAll('input[type="text"]').forEach(input => {
      input.classList.remove('selected');
    });
    this.selectedCells.forEach(({ row, col }) => {
      const input = this.shadowRoot.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
      if (input) {
        input.classList.add('selected');
      }
    });
  }

  focusCell(rowIndex, colIndex) {
    const input = this.shadowRoot.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex}"]`);
    if (input) {
      input.focus();
    }
  }

  cleanupTable() {
    this.csvData = this.csvData.filter(row => row.some(cell => cell.trim() !== ''));
    this.render();
    this.attachEventListeners();
  }

  updateTextarea() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      const csvRows = [this.columnHeadings.join(',')];
      csvRows.push(...this.csvData.map(row => row.join(',')));
      textarea.value = csvRows.join('\n');
    }
  }

  renderTableHead() {
    if (!Array.isArray(this.columnHeadings)) {
      console.error('columnHeadings is not an array.');
      return '';
    }

    return `
      <thead>
        <tr>
          ${this.columnHeadings.map(heading => `<th>${heading}</th>`).join('')}
        </tr>
      </thead>
    `;
  }

  renderTableBody() {
    if (!Array.isArray(this.csvData)) {
      console.error('csvData is not an array.');
      return '';
    }

    return `
      <tbody>
        ${this.csvData.map((row, rowIndex) => `
          <tr>
            ${row.map((cell, colIndex) => `
              <td>
                <input type="text" value="${cell}" data-row="${rowIndex}" data-col="${colIndex}">
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;
  }
}

customElements.define('csv-textarea', CSVTextarea);

export { CSVTextarea };
