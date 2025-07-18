

# TextareaAgentList

This is a web component targets a textarea that hold JSON of a list of agents. Agents are either people or organizations. People have a family and given names along with an ORCID. Organizations have a name along with a ROR. The list can contain either type of Agent.

### Overview

Library and Archives often of lists of people and organizations. In bibliographic material this would be the case for authors or contributors to a book or other published material. Lists are not natively supported in HTML web forms. The closest native element is a textarea which can contain an arbitrary number of lines. An early practice before JavaScript was invented was to teach people how to type in delimited text. After the introduction of JavaScript the JSON notation became a native browser structured data representation. For complex metadata objects describing a person or organization JSON provides a reasonably effective representation. How typing JSON into a textarea is error prone, hence this web component. If web components are not supported by the browser then an inner textarea element functions as a fallback. Otherwise the wrapping web component provide a reasonable interface for managing the list of agents.

### Key Features

- falls back to JSON inside a textarea
- agents support both the concept of a person or an organization
- the form can use POST method and the browser default url encoding for form data

### Attributes

- **style**: Allows you to set the CSS color and font size
- **css-href**: Allows you to overwrite the component's own CSS

### Usage

1. **Include the Component**: Ensure the component's JavaScript file is included in your HTML.

2. **HTML Structure**: Use the `<textarea-agent-list>` tag and include a `<textarea>` element inside it. The textarea can have JSON expressing a list of agents (people and organizations).

### Example

Here's an example of how to use the `<textarea-agent-list>` component in an HTML file:

```html
<textarea-agent-list>
    <textarea name="agentListJson" rows="11" cols="46">
[
    {
        "family_name": "Doe",
        "given_name": "John",
        "orcid": "0000-0000-0000-0000"
    },
    {
        "name": "Example Organization",
        "ror": "https://ror.org/05dxps055"
    }
]
    </textarea>
</textarea-agent-list>
```

This is how the standard textarea for that would look.

<p><textarea name="agentListJson" rows="11" cols="46">
[
    {
        "family_name": "Doe",
        "given_name": "John",
        "orcid": "0000-0000-0000-0000"
    },
    {
        "name": "Example Organization",
        "ror": "https://ror.org/05dxps055"
    }
]
</textarea></p>

<div id="demo">This is how the component version looks</div> 

<script type="module" src="textarea-agent-list.js" defer></script>

<script>
    const demo = document.getElementById('demo');
    const clonedElem = document.querySelector('textarea').cloneNode(true);
    const component = document.createElement('textarea-agent-list');
    component.appendChild(clonedElem);
    demo.appendChild(component);
    console.log("DEBUG demo.innerHTML", demo.innerHTML);
</script>



### Explanation

- **Component Tag**: The `<textarea-agent-list>` tag is used to define the component.
- **textarea**: The `<textarea>` inside the component contains JSON expressing a list. It provides the fallback if web components are not supported.

### Customization

- **style**: You can customize the style by providing color and font CSS. 
- **css-href**: This will allow you to fully customize the component by providing a replacement of the default styling.

### Conclusion

The `TextareaAgentList` component simplifies the creation of metadata applications that contain lists of people and organizations.
