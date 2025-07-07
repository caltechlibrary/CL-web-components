
# TextareaCSV

This is a web component intended to wrap a textarea where people would enter CSV encoded text.  By wrapping the textarea element we provide a fallback should JavaScript be unavailable.

## Overview

The `TextareaCSV` web component is designed to create an interactive table from CSV data, allowing users to edit the data directly in the table. It supports features like appending rows, cleaning up empty rows, and converting table data to and from CSV format.

## Key Features

- **CSV Parsing**: Automatically parses CSV data into a table format.
- **Editable Table**: Allows users to edit table cells directly.
- **Row Management**: Provides functionality to append rows and clean up empty rows.
- **Autocomplete**: Supports autocomplete for table cells using `<datalist>` elements.
- **Event Handling**: Dispatches custom events for cell changes and focus.

## Attributes

- **`column-headings`**: A comma-separated string of column headings for the table.
- **`id`**: Sets the ID of the component.
- **`class`**: Sets the class of the component.
- **`caption`**: Sets a caption for the table.
- **`text`**: Sets the initial text content of the table.
- **`placeholder`**: Sets the placeholder text for input fields in the table.
- **`css-href`**: Links to an external CSS file for styling.
- **`debug`**: Enables debug mode, which logs additional information to the console.
- **`title`**: Sets a title for the help icon.
- **`help-description`**: Sets a description for the help icon.

## Usage

1. **Include the Component**: Ensure the component's JavaScript file is included in your HTML.

2. **HTML Structure**: Use the `<textarea-csv>` tag and include a `<textarea>` with CSV data inside it.

## Example

Here's an example of how to use the `TextareaCSV` component in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TextareaCSV Component Example</title>
  <script type="module" src="path/to/your/TextareaCSV.js"></script>
</head>
<body>
  <textarea-csv column-headings="Name,Age,City" debug>
    <textarea>
      John Doe,30,New York
      Jane Smith,25,Los Angeles
    </textarea>
  </textarea-csv>
</body>
</html>
```

## Explanation

- **Component Tag**: The `<textarea-csv>` tag is used to define the component.
- **Column Headings**: The `column-headings` attribute specifies the headings for the table columns.
- **Debug Mode**: The `debug` attribute enables debug mode, which logs additional information to the console.
- **Textarea**: The `<textarea>` inside the component contains the initial CSV data.

## Customization

- **Styling**: You can customize the styles by modifying the CSS in the `initializeComponent` method or by linking to an external CSS file using the `css-href` attribute.
- **Autocomplete**: Use `<datalist>` elements to provide autocomplete options for table cells.
- **Event Listeners**: Customize event listeners in the `setupEventListeners` method to handle specific interactions.

## Conclusion

The `TextareaCSV` component simplifies the creation of editable tables from CSV data, making it easier to manage and interact with tabular data in web applications. By following the usage guidelines and customizing as needed, you can integrate this component into your web projects seamlessly.
