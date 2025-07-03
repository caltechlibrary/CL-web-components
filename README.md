
# CL-web-components

CL-web-components provides a collection of Web Components used by Caltech Library in various web sites and projects.

The following are the components currently provided.


`a-to-z-ul`
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

`csv-textarea`
: This is a textarea like component who's innerHTML content is CSV data. The component will display this as an editable table. 

`input-agent-list`
: This element wraps a textarea containing a list of agents expressed as JSON. 

`sortable-table`
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on.

## Release Notes

- version: 0.0.9
- status: wip
- released: 2025-07-03

Added a new &#x60;&lt;input-agent-list&gt;&lt;/input-agent-list&gt;&#x60; web component.  This allows you to use a textarea containing a list of agents (people and organizations)
to be presented as a friendly editing element while preserving the textarea with JSON as a fallback.

### Authors

- Doiel, R. S.

### Maintainers

- Doiel, R. S.

## Related resources


- [Download](https://github.com/caltechlibrary/CL-web-components/releases)
- [Getting Help, Reporting bugs](https://github.com/caltechlibrary/CL-web-components/issues)
- [LICENSE](https://caltechlibrary.github.io/CL-web-components/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

