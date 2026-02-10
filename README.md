

# CL-web-components

CL-web-components provides a collection of Web Components used by Caltech Library across sites and projects.

The following are the components currently provided.

`card-layout`
: This component provides a customizable three card layout for content presentation.

`footer-global`
: This component provides a standard footer with detailed information about the library

`footer-global-lite`
: This component provides a lighter weight version of the `footer-global` component

`ul-a-to-z`
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

`textarea-csv`
: This is a textarea like component who's innerHTML content is CSV data. The component will display this as an editable table. 

`textarea-agent-list`
: This element wraps a textarea containing a list of agents expressed as JSON. 

`table-sortable`
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on.

## Release Notes

- version: 0.0.16
- status: wip
- released: 2026-01-28

This release adds a new &#x60;&lt;card-layout&gt;&#x60; component for displaying three-card layouts with images, titles, descriptions, and links. The component is responsive and uses attributes to set the content values.


### Authors

- Doiel, R. S.
- Smith, Twila


### Maintainers

- Doiel, R. S.
- Smith, Twila

## Software Requirements

- Deno &gt;&#x3D; 2.4.3 (for bundling dependencies)

### Software Suggestions

- CMTools &gt;&#x3D; 0.0.40
- Pandoc &gt;&#x3D; 3.1
- PageFind &gt;&#x3D; 1.3

#### Runtime platform

HTML5-compatible web browser**

## Related resources


- [Download](https://github.com/caltechlibrary/CL-web-components/releases)
- [Getting Help, Reporting bugs](https://github.com/caltechlibrary/CL-web-components/issues)
- [LICENSE](https://caltechlibrary.github.io/CL-web-components/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

