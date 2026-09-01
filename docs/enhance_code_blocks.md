
# Enhancing code blocks with CSS and JavaScript

This document describes how to use the `code-blocks.css` and `copyToClipboard.js` files to style code blocks and add a "Copy to Clipboard" button to them.

## Overview

The provided CSS and JavaScript files allow you to style `<pre>` and `<code>` elements and add a button to copy the code to the clipboard. This is useful for displaying code snippets on a webpage with a consistent style and enhanced functionality.

## Files

`code-blocks.css`
: A CSS file that styles the `<pre>` and `<code>` elements and the copy button.

`copyToClipboard.js`
: A JavaScript module that adds a "Copy to Clipboard" button to each `<pre>` block containing a `<code>` element.

## CSS Variables

The `code-blocks.css` file uses CSS variables to define the styling properties. These variables can be easily overridden to customize the appearance of the code blocks and the copy button.

### Code Block Variables

`--code-font-family`
: Font family for the code block. Default is `monospace`.

`--code-border-color`
: Border color for the code block. Default is `#ccc`.

`--code-background-color`
: Background color for the code block. Default is `#f5f5f5`.

### Copy Button Variables

`--copy-button-bg-color`
: Background color for the copy button. Default is `#fff`.

`--copy-button-border-color`
: Border color for the copy button. Default is `#ccc`.

`--copy-button-text-color`
: Text color for the copy button. Default is `#000`.

`--copy-button-hover-bg-color`
: Background color for the copy button on hover. Default is `#f0f0f0`.

## Usage

### Step 1: Include the CSS File

Link the `code-blocks.css` file in the `<head>` section of your HTML document:

```html
<link rel="stylesheet" href="path/to/code-blocks.css">
```

### Step 2: Include the JavaScript Module

Include the `copyToClipboard.js` module in your HTML document. This script should be included at the end of the `<body>` section or use the `DOMContentLoaded` event to ensure the DOM is fully loaded before executing the script.

```html
<script type="module" src="path/to/copyToClipboard.js"></script>
```

### Step 3: Add Code Blocks to Your HTML

Add `<pre>` and `<code>` elements to your HTML document. The JavaScript module will automatically add a "Copy to Clipboard" button to each `<pre>` block containing a `<code>` element.

```html
<pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}</code></pre>

<pre><code>public class AnotherExample {
    public static void main(String[] args) {
        System.out.println("Another example!");
    }
}</code></pre>
```

### Example: Full HTML Document

Here is an example of a complete HTML document that includes the CSS and JavaScript files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Blocks Example</title>
  <link rel="stylesheet" href="path/to/code-blocks.css">
</head>
<body>

<h1>Code Examples</h1>

<pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}</code></pre>

<pre><code>public class AnotherExample {
    public static void main(String[] args) {
        System.out.println("Another example!");
    }
}</code></pre>

<script type="module" src="path/to/copyToClipboard.js"></script>
</body>
</html>
```

### Step 4: Customize the Styling (Optional)

You can override the CSS variables to customize the appearance of the code blocks and the copy button. Add a `<style>` block to your HTML document and redefine the variables as needed.

```html
<style>
  :root {
    --code-font-family: 'Courier New', monospace;
    --code-border-color: #ff5733;
    --copy-button-bg-color: #e7e7e7;
    --copy-button-border-color: #ff5733;
  }
</style>
```

## JavaScript Functionality

The `copyToClipboard.js` module performs the following actions:

1. Waits for the `DOMContentLoaded` event to ensure the DOM is fully loaded.
2. Finds all `<pre>` elements in the document.
3. For each `<pre>` element, checks if it contains a `<code>` element.
4. Creates a button with the clipboard emoji (📋) and appends it to the `<pre>` element.
5. Adds an event listener to the button to copy the text content of the `<code>` element to the clipboard when clicked.
6. Provides feedback by changing the button text to "Copied!" for a short period after copying.

## Conclusion

By following these steps, you can style code blocks and add a "Copy to Clipboard" button to them using the provided CSS and JavaScript files. This enhances the user experience by making it easy to copy code snippets from your webpage.

### Example: Customized HTML Document

Here is an example of a complete HTML document with customized styling:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customized Code Blocks Example</title>
  <link rel="stylesheet" href="path/to/code-blocks.css">
  <style>
    :root {
      --code-font-family: 'Courier New', monospace;
      --code-border-color: #ff5733;
      --copy-button-bg-color: #e7e7e7;
      --copy-button-border-color: #ff5733;
    }
  </style>
</head>
<body>

<h1>Customized Code Examples</h1>

<pre><code>public class CustomHelloWorld {
    public static void main(String[] args) {
        System.out.println("Custom Hello, world!");
    }
}</code></pre>

<pre><code>public class CustomExample {
    public static void main(String[] args) {
        System.out.println("Another customized example!");
    }
}</code></pre>

<script type="module" src="path/to/copyToClipboard.js"></script>
</body>
</html>
```

This setup allows you to maintain a clean and organized stylesheet with reusable variables and provides the flexibility to override these variables as needed.