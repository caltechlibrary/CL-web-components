
# Footer Global & Global Lite

This web component is designed to add a branded footer to applications maintained by the library.

### Overview

The `Global Footer` web component provides a branded footer for library-maintained applications. The global footer represents the library's standard footer.  The lite footer is for pages that are less public, such as documentation, where consistency is desired but the need for full footer features is not necessary.


### Key Features

- **Branded Footer**: Inserts a library branded footer.
- **Universal Library Links**: Allows for the universal updating of links by updating them within the component.
- **Custom Links**: Allows application developers to create a custom set of links when they call the component.

### Attributes

- **`slot`**: When this attribute is present, a developer can create custom links per application.

### Usage

1. **Include the Component**: Ensure the component's JavaScript file is included in your HTML.

2. **HTML Structure**: Use the `<footer-global>` or `<footer-global-lite>` tag and include a links inside to create custom links.

### Example

#### Implementation

Here's an example of how to use the `FooterGlobal` component in an HTML file:

```html
   <footer-global>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 1</a>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 2</a>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 3</a>
  </footer-global>
```

### Explanation

- **Component Tag**: The `<footer-global>` or `<footer-global-lite>` tag is used to define the component.
- **Custom Links**: The `<a>` inside the component defines the custom links.
- **`slot` Attribute**: Adding the `slot` attribute will display the custom links instead of the default links.


### Conclusion

The `FooterGlobal` component simplifies the creation of a library branded footer.

