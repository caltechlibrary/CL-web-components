
# ULAtoZList

This is a web component targeting simple A to Z lists derived from UL lists. It wraps an innerHTML that contains a UL list as the fallback if JavaScript is unavailable.


### Overview

The `ULAToZList` web component is designed to create an alphabetical menu from a list of items. It organizes the items into sections based on their initial letter and provides navigation between these sections.

### Key Features

- **Alphabetical Menu**: Automatically generates a menu with links to each letter section.
- **Section Navigation**: Allows smooth scrolling to each section when a menu item is clicked.
- **Back to Menu**: Optionally displays a "Back to Menu" link when the `long` attribute is present.

### Attributes

- **`long`**: When this attribute is present, a "Back to Menu" link is displayed at the end of each section.

### Usage

1. **Include the Component**: Ensure the component's JavaScript file is included in your HTML.

2. **HTML Structure**: Use the `<ul-a-to-z-list>` tag and include a `<ul>` with `<li>` items inside it.

### Example

#### Implementation

Here's an example of how to use the `ULAToZList` component in an HTML file:

```html
  <ul-a-to-z-list>
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Cherry</li>
      <li>Date</li>
      <li>Elderberry</li>
    </ul>
  </ul-a-to-z-list>
```

Here's that UL list without the web component wraping it

- Apple
- Banana
- Cherry
- Date
- Elderberry

<div id="demo">Here's the version with an A to Z list integrated.</div>

<script type="module" src="ul-a-to-z-list.js" defer></script>

<script>
    const demo = document.getElementById('demo');
    const clonedUL = document.querySelector('ul:nth-of-type(3)').cloneNode(true);
    const aToZList = document.createElement('ul-a-to-z-list');
    aToZList.setAttribute('long', true);
    aToZList.appendChild(clonedUL);
    demo.appendChild(aToZList);
    console.log("DEBUG demo.innerHTML", demo.innerHTML);
</script>

### Explanation

- **Component Tag**: The `<ul-a-to-z-list>` tag is used to define the component.
- **List Items**: The `<ul>` inside the component contains the items to be organized alphabetically.
- **`long` Attribute**: Adding the `long` attribute will display a "Back to Menu" link.

### Customization

- **Styling**: You can customize the styles within the component's shadow DOM by modifying the CSS in the `render` method.
- **Behavior**: The `scrollToSection` method can be adjusted to change the scrolling behavior or offset.

### Conclusion

The `ULAToZList` component simplifies the creation of alphabetical navigation menus, making it easier to organize and navigate large lists of items. By following the usage guidelines and customizing as needed, you can integrate this component into your web projects seamlessly.

