
# Autocomplete Web component

I am implementing an ES6 module called "autocomplete.js". It implemented a web component called "AutocompleteData". The web component wraps a data HTML element contianing suggestions to match against one per line. The web component needs to display a suggestion list based on the content of the data element. A user can continue to type updating the suggestion list, press the escape to ignore the autocomplete or press enter to accept a suggestion. When there is only one suggestion pressing enter will accept the suggestion. When there is more than one suggestion the top suggestion is highlighted by default. The user should be able to navigate the selection list using the arrow keys or a mouse. 

Using the AutocompleteData element would look something like this.

```html
<autocomplete-data for="fruits"><data>
</data>Apple
Banana
Orange
Strawberry
Elderberry
Huckleberry
</autocomplete-data>
<p>
<input id="fruits" type="text">
</p>
```

The AutocomleteData element has an boolean attribute "ignore-case". It defaults to false. When false perform a case sensitive search for suggestions. Then true perform a case insensitive search for suggestions.

The AutocompleteData element has an attribute "css-href". The "css-href" attribute is used to fetch custom CSS for AutocompleteData and replaces the default CSS provided by the HTMLTemplate.


