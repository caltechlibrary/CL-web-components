
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

Here's an example of how to use the `ULAToZList` component in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ULAToZList Component Example</title>
  <script type="module" src="ul-a-to-z-list.js"></script>
</head>
<body>
  <ul-a-to-z-list long>
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Cherry</li>
      <li>Date</li>
      <li>Elderberry</li>
      <!-- Add more items as needed -->
    </ul>
  </ul-a-to-z-list>
</body>
</html>
```

### Explanation

- **Component Tag**: The `<ul-a-to-z-list>` tag is used to define the component.
- **List Items**: The `<ul>` inside the component contains the items to be organized alphabetically.
- **`long` Attribute**: Adding the `long` attribute will display a "Back to Menu" link.

### Customization

- **Styling**: You can customize the styles within the component's shadow DOM by modifying the CSS in the `render` method.
- **Behavior**: The `scrollToSection` method can be adjusted to change the scrolling behavior or offset.

### Conclusion

The `ULAToZList` component simplifies the creation of alphabetical navigation menus, making it easier to organize and navigate large lists of items. By following the usage guidelines and customizing as needed, you can integrate this component into your web projects seamlessly.
