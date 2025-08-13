/**
 * TableSortable makes a table sortable and optionally searchable.
 */

export class TableSortable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        
        
        /* Table styles */
        
        div#tableContainer {
          width: 90%;
        }
        
        div#tableContainer table {
          width: 100%;
          border-collapse: collapse;
        }
        
        div#tableContainer table th {
          background-color: #f2f2f2;
          cursor: pointer;
        }

        div#tableContainer table th:hover {
          background-color: #ddd;
        }

        div#tableContainer table th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
         /* Search styles */

        div#search {
          width: 90%;
          background-color: #f2f2f2;
          border-radius: 6px;
        }

        div#search table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          margin-top: 1.5rem;
        }
        
        /* Search - Inputs */
        
        div#search table tr.filter-input th {         
          padding: 20px 20px 5px 10px;
          border: none;
          text-align: left;
        }

        div#search table input {
          width: 100%;
          box-sizing: border-box;
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        /* Search - Buttons */

        div#search table tr.search-buttons th {         
          padding: 5px 20px 20px 10px;
          border: none;
          text-align: left;
        }
        
        div#search table tr.search-buttons button.search-btn {         
          background-color: #f5654b;
          color: white;
          margin: 10px 10px 10px 0px;
          border: none;
          padding: 6px 10px 6px 10px;
          border-radius: 4px;
        }

        div#search table tr.search-buttons button.clear-btn {         
          color: blue;
          margin: 10px 10px 10px 0px;
          border: none;
          padding: 6px 10px 6px 10px;
          border-radius: 4px;
          text-decoration: underline;
        }

      </style>
      <div id="search"> </div>
      <div id="tableContainer"> </div>
    `;

    this.tableContainer = this.shadowRoot.getElementById("tableContainer");
  }

  connectedCallback() {
    // Initialize table and optional search controls
    const table = this.querySelector("table");
    if (table) {
      const tableClone = table.cloneNode(true);
      this.tableContainer.appendChild(tableClone);
      if (this.getAttribute("search") === "true") {
        this.createMultiSearchControls(tableClone);
      }
      this.setupTableSortable(tableClone);
    }
  }

  setupTableSortable(table) {
    // Setup sorting on header clicks
    const headerRow = table.querySelector("thead tr.sort-header");
    const headers = headerRow.querySelectorAll("th");
    const tbody = table.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");

    headers.forEach((header, index) => {
      header.addEventListener("click", () => {
        this.sortTable(index, rows);
      });
    });
  }

  createMultiSearchControls(table) {
    // Create multi-column search inputs and buttons
    const headers = table.querySelectorAll("thead th");
    this.filters = Array.from({ length: headers.length }, () => "");

    // Gives the table row for input filters a class for styling
    const thead = table.querySelector("thead");
    const filterRow = document.createElement("tr");
    filterRow.classList.add("filter-input");

    headers.forEach((header, index) => {
      const filterCell = document.createElement("th");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = header.textContent.trim();
      input.dataset.column = index;
      input.addEventListener("input", (e) => {
        this.filters[index] = e.target.value.toLowerCase();
      });
      filterCell.appendChild(input);
      filterRow.appendChild(filterCell);
    });

    // Gives the table row for search buttons a class for styling
    const searchRow = document.createElement("tr");
    searchRow.classList.add("search-buttons");
    const searchCell = document.createElement("th");
    searchCell.colSpan = headers.length;

    // Sets functionality of search button and gives it a class for styling
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.classList.add("search-btn");
    searchButton.addEventListener("click", () => this.applyFilters(table));

     // Sets functionality of clear button and gives it a class for styling
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear All";
    clearButton.classList.add("clear-btn");
    clearButton.addEventListener("click", () => {
      this.filters = this.filters.map(() => "");
      filterRow.querySelectorAll("input").forEach((input) => (input.value = ""));
      externalFilterRow.querySelectorAll("input").forEach((input) => (input.value = ""));
      this.applyFilters(table);
    });

    searchCell.appendChild(searchButton);
    searchCell.appendChild(clearButton);
    searchRow.appendChild(searchCell);

    thead.insertBefore(filterRow, thead.firstChild);

    const allRows = thead.querySelectorAll("tr");
    const trueHeaderRow = allRows[allRows.length - 1];
    trueHeaderRow.classList.add("sort-header");

    const externalFilterRow = filterRow.cloneNode(true);

    const externalInputs = externalFilterRow.querySelectorAll("input");
    externalInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        this.filters[index] = e.target.value.toLowerCase();
      });
    });

     // Pulls out the filter and search rows into their own search div container for styling
    const wrapperTable = document.createElement("table");
    wrapperTable.classList.add("external-filters");
    const wrapperThead = document.createElement("thead");
    wrapperThead.appendChild(externalFilterRow);
    wrapperThead.appendChild(searchRow);
    wrapperTable.appendChild(wrapperThead);
    this.shadowRoot.querySelector("#search").appendChild(wrapperTable);

    filterRow.style.display = "none";

    // Sets the width of the filter row columns to 90% of the width of the sort-header rows
    // This allows the input fields to be the same size as the column they are associated with
    // with a little extra room, hence the 90%.... doesn't respond as screen is resized but will
    // resize on refresh. This will allow the data colums to expand based on content and the input
    // fields will match on refresh.

    requestAnimationFrame(() => {
      const originalHeaders = thead.querySelectorAll("tr.sort-header th");
      const externalInputs = externalFilterRow.querySelectorAll("input");
      originalHeaders.forEach((th, index) => {
        const width = th.getBoundingClientRect().width;
        if (externalInputs[index]) {
          externalInputs[index].style.width = `${width * 0.9}px`;
        }
      });
    });
  }

  applyFilters(table) {
    // Filter table rows based on input values
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      let visible = true;

      this.filters.forEach((filterValue, colIndex) => {
        const cellText = row.cells[colIndex]?.textContent.toLowerCase() || "";
        if (!cellText.includes(filterValue)) {
          visible = false;
        }
      });

      row.style.display = visible ? "" : "none";
    });
  }

  sortTable(columnIndex, rows) {
    // Sort rows by the specified column
    const tbody = this.tableContainer.querySelector("tbody");
    const rowsArray = Array.from(rows);
    const isAscending = !this.isSortedAscending(columnIndex);

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent;
      const cellB = rowB.cells[columnIndex].textContent;
      return isAscending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    rowsArray.forEach((row) => tbody.appendChild(row));
  }

  isSortedAscending(columnIndex) {
    // Check if column is sorted ascending
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
}

customElements.define("table-sortable", TableSortable);
