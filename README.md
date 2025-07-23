

# CL-web-components

CL-web-components provides a collection of Web Components used by Caltech Library across sites and projects.

The following are the components currently provided.


`ul-a-to-z`
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

`textarea-csv`
: This is a textarea like component who's innerHTML content is CSV data. The component will display this as an editable table. 

`textarea-agent-list`
: This element wraps a textarea containing a list of agents expressed as JSON. 

`table-sortable`
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on.

`footer-global`
: This is a component that inserts a library branded footer into applications maintained by the library. There is a full and lite version of the footer available.

## Release Notes

- version: 0.0.12
- status: wip
- released: 2025-07-17

This release includes a re-organization of the project source code. Editable code is now maintained in &#x60;src/&#x60;.  The bundled versions
are retained in the root of the repository. Distribution versions are generating in the &#x60;dist/&#x60; directory.

Deno 2.4.1 or better is now a requirement to build the bundled versions.

Additional documentation has been updated and improved in preparation for eventual integration into the Caltech Library design system.
The web component, &#x60;textarea-csv&#x60; now uses the &#x60;jsr:@std/csv&#x60; library which provides robusts CSV support.


### Authors

- Doiel, R. S.
- Smith, Twila



### Maintainers

- Doiel, R. S.

## Software Requirements

- Deno &gt;&#x3D; 2.4.1 (for bundling dependencies)

### Software Suggestions

- CMTools &gt;&#x3D; 0.0.35
- Pandoc &gt;&#x3D; 3.1

#### Runtime platform

HTML5-compatible web browser**

## Related resources


- [Download](https://github.com/caltechlibrary/CL-web-components/releases)
- [Getting Help, Reporting bugs](https://github.com/caltechlibrary/CL-web-components/issues)
- [LICENSE](https://caltechlibrary.github.io/CL-web-components/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

