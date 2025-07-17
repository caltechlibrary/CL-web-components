
# Web Component CSS Implementation

One challenge and feature of web components is that they ecapsulate the component as a single HTML element. This is a design feature of web components that insure safe default behaviors.  If the web component itself contains HTML elements the isolation maybe important for component rendering and behavior.  On the otherhand if the web component itself contains standard HTML elements and they should inherit form the page level style sheet you have a problem. The safety of an encampulated component because a barrier to how we traditionally expect CSS to apply.

Adding inheritance inside the web component should be weighed carefully. If it is desirable to inherit an external CSS ruleset you have several options.  First is to include the refererence as an import in the HTML template for the object. This is useful where the component will be used in a design system and the design system specifies the required CSS files and their locations.

Another approach is to passing in styling or stylesheet references via the web component's attributes. This can be done by defining the attributes `style` and `css-href` (or something similar). Having the `style` attributes the practice used generally with standard HTML elements. The style passed in can be vetted to make senses in the context of the whole component's rendering. A use case that fits this approach is here you might want the color scheme or front choice to pass through to the component. The `css-href` approach is slightly more complex. Before the HTML template text is instanciated you need to include the references to the CSS being included. It remains unclear if the web component can take advantage of the page's own CSS cache or if it will require an additional explicit download of the CSS. This area needs to exploration and testing to confirm behaviors.

All the approaches are reasonable assuming the trade offs and limitations are understood.

## Master stylesheet appoach

Here's are some use case examples of in corporating a master stylesheet approach (explitily include an `@import` rule in the component's style element).

### CSS Custom Properties (Variables)

Use CSS custom properties (also known as CSS variables) in your master CSS file. These variables can be defined globally and accessed within your web components.

~~~CSS
/* master.css */
:root {
  --primary-color: #4285f4;
  --secondary-color: #34a853;
  --font-family: 'Roboto', sans-serif;
}
~~~

In your web component, you can use these variables:

~~~CSS
/* Inside your web component's styles */
.my-element {
  color: var(--primary-color);
  font-family: var(--font-family);
}
~~~

### External Stylesheets in Shadow DOM:

You can include external stylesheets within your Shadow DOM by using JavaScript to clone the styles and append them to the Shadow DOM.

~~~JavaScript
const template = document.createElement('template');
template.innerHTML = `
  <style>
    @import url('master.css');
  </style>
  <div class="my-element">Styled content</div>
`;

class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}

customElements.define('my-element', MyElement);
~~~

### Constructable Stylesheets:

Use Constructable Stylesheets to share styles across multiple shadow roots. This allows you to define styles once and use them in multiple components.

~~~JavaScript
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  .my-element {
    color: var(--primary-color);
  }
`);

class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}

customElements.define('my-element', MyElement);
~~~

### CSS Inheritance:

Some CSS properties are inherited by default (e.g., font-family, color). You can leverage these properties to style your web components without piercing the Shadow DOM.

~~~CSS
/* master.css */
body {
  font-family: var(--font-family);
  color: var(--primary-color);
}
~~~

These styles will be inherited by the elements inside your web component unless explicitly overridden.

#### `::part` and `::theme:`

Use the `::part` and `::theme` pseudo-elements to style specific parts of your web components from outside the Shadow DOM.

~~~CSS
/* master.css */
my-element::part(button) {
  background-color: var(--primary-color);
}
~~~

#### In your web component:

~~~HTML
<button part="button">Click me</button>
~~~

By using these strategies, you can effectively integrate a master CSS file with your web components while respecting the encapsulation provided by the Shadow DOM.


## Configurable CSS via component attributes

You can conditionally include CSS and supply default styles for web components. This can be achieved through a combination of JavaScript logic and CSS management. Here are some strategies to accomplish this:

### Dynamic Stylesheet Loading:

You can use JavaScript to dynamically load stylesheets based on certain conditions. This allows you to include different stylesheets depending on the context or user preferences.

~~~JavaScript
function loadStylesheet(href, id) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.id = id;
  document.head.appendChild(link);
}

// Conditionally load stylesheet
if (someCondition) {
  loadStylesheet('special-styles.css', 'special-styles');
} else {
  loadStylesheet('default-styles.css', 'default-styles');
}
~~~

### Inline Default Styles:

Provide default styles inline within your web component. You can then override these styles by conditionally loading external stylesheets.

~~~JavaScript
const template = document.createElement('template');
template.innerHTML = `
  <style>
    /* Default styles */
    .my-element {
      color: black;
      font-family: Arial, sans-serif;
    }
  </style>
  <div class="my-element">Styled content</div>
`;

class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Conditionally load external stylesheet
    if (this.hasAttribute('special')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'special-styles.css';
      this.shadowRoot.appendChild(link);
    }
  }
}

customElements.define('my-element', MyElement);
~~~

### CSS Custom Properties with Fallbacks:

Use CSS custom properties with fallback values to provide default styles. You can then conditionally override these properties.

~~~CSS
/* Default styles using CSS custom properties with fallbacks */
.my-element {
  color: var(--my-element-color, black);
  font-family: var(--my-element-font, Arial, sans-serif);
}
~~~

~~~JavaScript
// Conditionally override CSS custom properties
if (someCondition) {
  document.documentElement.style.setProperty('--my-element-color', 'blue');
  document.documentElement.style.setProperty('--my-element-font', 'Helvetica, sans-serif');
}
~~~

### Using JavaScript to Toggle Classes:

Apply different classes to your web component based on conditions and define styles for these classes in your CSS.

~~~JavaScript
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .default-style {
          color: black;
          font-family: Arial, sans-serif;
        }
        .special-style {
          color: blue;
          font-family: Helvetica, sans-serif;
        }
      </style>
      <div class="my-element">Styled content</div>
    `;
  }

  connectedCallback() {
    const element = this.shadowRoot.querySelector('.my-element');
    if (this.hasAttribute('special')) {
      element.classList.add('special-style');
    } else {
      element.classList.add('default-style');
    }
  }
}

customElements.define('my-element', MyElement);
~~~

By using these techniques, you can conditionally include CSS and supply default styles for your web components, making them more flexible and adaptable to different contexts and user preferences.

