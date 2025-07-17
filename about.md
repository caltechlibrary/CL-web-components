---
title: CL-web-components
abstract: "CL-web-components provides a collection of Web Components used by Caltech Library across sites and projects.

The following are the components currently provided.


&#x60;ul-a-to-z&#x60;
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

&#x60;textarea-csv&#x60;
: This is a textarea like component who&#x27;s innerHTML content is CSV data. The component will display this as an editable table. 

&#x60;textarea-agent-list&#x60;
: This element wraps a textarea containing a list of agents expressed as JSON. 

&#x60;table-sortable&#x60;
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on."
authors:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903
  - family_name: Smith
    given_name: Twila
    id: https://orcid.org/0009-0003-7975-1922


maintainer:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903

repository_code: https://github.com/caltechlibrary/CL-web-components
version: 0.0.12
license_url: https://caltechlibrary.github.io/CL-web-components/LICENSE

programming_language:
  - JavaScript
  - HTML
  - CSS

keywords:
  - HTML
  - CSS
  - JavaScript
  - ES6
  - Web Components

date_released: 2025-07-17
---

About this software
===================

## CL-web-components 0.0.12

This release includes a re-organization of the project source code. Editable code is now maintained in &#x60;src/&#x60;.  The bundled versions
are retained in the root of the repository. Distribution versions are generating in the &#x60;dist/&#x60; directory.

Deno 2.4.1 or better is now a requirement to build the bundled versions.

Additional documentation has been updated and improved in preparation for eventual integration into the Caltech Library design system.
The web component, &#x60;textarea-csv&#x60; now uses the &#x60;jsr:@std/csv&#x60; library which provides robusts CSV support.

### Authors

- R. S. Doiel, <https://orcid.org/0000-0003-0900-6903>
- Twila Smith, <https://orcid.org/0009-0003-7975-1922>




### Maintainers

- R. S. Doiel, <https://orcid.org/0000-0003-0900-6903>


CL-web-components provides a collection of Web Components used by Caltech Library across sites and projects.

The following are the components currently provided.


&#x60;ul-a-to-z&#x60;
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

&#x60;textarea-csv&#x60;
: This is a textarea like component who&#x27;s innerHTML content is CSV data. The component will display this as an editable table. 

&#x60;textarea-agent-list&#x60;
: This element wraps a textarea containing a list of agents expressed as JSON. 

&#x60;table-sortable&#x60;
: This is a component that takes an innerHTML containing table. It makes the table sortable by the column headings and provides a filter input that lets you enter text to filter by and pick a column to filter on.

- License: <https://caltechlibrary.github.io/CL-web-components/LICENSE>
- GitHub: <https://github.com/caltechlibrary/CL-web-components>
- Issues: <https://github.com/caltechlibrary/CL-web-components/issues>

### Programming languages

- JavaScript
- HTML
- CSS




### Software Requirements

- Deno &gt;&#x3D; 2.4.1 (for bundling dependencies)


### Software Suggestions

- CMTools &gt;&#x3D; 0.0.35
- Pandoc &gt;&#x3D; 3.1


