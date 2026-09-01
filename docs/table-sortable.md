---
title: Table Sortable Web Component
---

# Table Sortable Web Component

This web component wraps a standard HTML table. It displays the table and makes it sortable by the column headings
and provides a search filter element that operates on the table by column.

## Example

This is a standard table without the web component.

Name       University                    Graduation Year
---------- ----------------------------- -----------------
Alice      Mills College                 1922
Sr. Mary   Mount Saint Mary\'s College   1919
Georgina   Smith College                 1925
Evelyn     Barnard College               1920


<div id="demo">
The sortable of version is here.
</div>

<script type="module" src="table-sortable.js"></script>

<script>
    const demo = document.getElementById('demo');
    const clonedTable = document.querySelector('table').cloneNode(true);
    const sortableTable = document.createElement('table-sortable');
    sortableTable.appendChild(clonedTable);
    demo.appendChild(sortableTable);
</script>

See a the [Table Sortable Demo](demo_table-sortable.html)
