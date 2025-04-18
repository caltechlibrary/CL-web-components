---
title: CL-web-components
abstract: "CL-web-components provides a collection of Web Components used by Caltech Library in various web sites and projects.

The following are the components currently provided.

&#x60;csv-textarea&#x60;
: This is a textarea like component who&#x27;s innerHTML content is CSV data. The component will display this as an editable table. 

&#x60;a-to-z-ul&#x60;
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

One additional helper module is currently provided, &#x60;parseCSV.js&#x60;, that provides stringify and parse functions for CSV rows and strings."
authors:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903

contributor:
  - name: Mistral
    id: https://mistral.ai

maintainer:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903

repository_code: https://github.com/caltechlibrary/CL-web-components
version: 0.0.5
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

date_released: NaN-NaN-NaN
---

About this software
===================

## CL-web-components 0.0.5

Added an optional function &#x60;customCleanupFilter&#x60; to the csvtextarea web component. The function is expected to operate on an HTML object containing the row being evalated. If the user defined function returns true the row is accepted. If false the row will be removed.

### Authors

- R. S. Doiel, <https://orcid.org/0000-0003-0900-6903>

### Contributors

- Mistral, <https://mistral.ai>

### Maintainers

- R. S. Doiel, <https://orcid.org/0000-0003-0900-6903>

CL-web-components provides a collection of Web Components used by Caltech Library in various web sites and projects.

The following are the components currently provided.

&#x60;csv-textarea&#x60;
: This is a textarea like component who&#x27;s innerHTML content is CSV data. The component will display this as an editable table. 

&#x60;a-to-z-ul&#x60;
: This component takes an innerHTML containing a UL list. The UL list is then turned into an A to Z navigatable UL List. If JavaScript is unavailable then the innerHTML UL remains as a fallback.

One additional helper module is currently provided, &#x60;parseCSV.js&#x60;, that provides stringify and parse functions for CSV rows and strings.

- License: <https://caltechlibrary.github.io/CL-web-components/LICENSE>
- GitHub: <https://github.com/caltechlibrary/CL-web-components>
- Issues: <https://github.com/caltechlibrary/CL-web-components/issues>

### Programming languages

- JavaScript
- HTML
- CSS





