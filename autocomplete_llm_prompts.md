
# Autocomplete Web component

I am implementing an ES6 module called "autocomplete.js". It implemented aweb component called "AutocompleteData". The web component wraps a data HTML element contianing suggestions to match against one per line. The web component needs to display the potention autocomplete list based on matching the input elements content entered so far. A user can continue to type updating the suggestion list, press the escape to ignore the autocomplete or accept a suggestions which then updates the input element.

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

You should be able navigate the select by either continuing to type or with the up and down arrow keys. The up and down arrow keys should scroll the suggestion list keeping the currently selected text visible.

The AutocomleteData element has an boolean attribute "ignore-case". It defaults to false. When false perform a case sensitive search for suggestions. Then true perform a case insensitive search for suggestions.
