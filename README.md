

# CL-web-components 0.0.4

CL-web-components provides a collection of Web Components used by Caltech Library in various web sites and projects.

The following are the components currently provided.

`csv-textarea`
: This is a textarea like component who's innerHTML content is CSV data. The component will display this as an editable table. 

`a-to-z-ul`
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

`sortable-table`
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on.

One additional helper module is currently provided, `parseCSV.js`, that provides stringify and parse functions for CSV rows and strings.

## Release Notes

- version: 0.0.4
- status: wip
- released: 2025-03-12

Bug fix correcting missing events of &quot;focused&quot; and &quot;changed&quot; in CSVTextarea.


### Authors

- Doiel, R. S.


### Contributors

- Mistral


### Maintainers

- Doiel, R. S.


Uses: - HTML5-compatible web browser

## Related resources


- [Download](https://github.com/caltechlibrary/CL-web-components/releases)
- [Getting Help, Reporting bugs](https://github.com/caltechlibrary/CL-web-components/issues)
- [LICENSE](https://caltechlibrary.github.io/CL-web-components/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

