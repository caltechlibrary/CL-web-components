
# Footer Global & Global Lite

This web component is designed to add a branded footer to applications maintained by the library. 

There are two versions of the footer - the standard footer that matches the library website, and a lite version with a streamlined content structure. 

The standard footer has several options for customization using both attribures and slot to change the content that is displayed.

## Key Features

Once installed, the application will get any updates to the footer automatically whenever a new version of the component is released. This allows a streamlined way to update the footer and have those changes immediately reflected on all applications calling it.

The standard component also has several options for customization, including:

- Custom column header
- Application-specific links
- Configurable contact information
- Customizable social media links
- The ability to change the logo version between archives and the library.

## Installing

To install the footer, simply included the javascript file and the extended html element as such:

<footer-global></footer-global>
 
 And the javascript file.

 <script type="module" src="/src/footer-global.js"></script> (updated link coming soon)


## Customizing

There are multiple ways to customize `Footer-Global`. 

```Please keep in mind, `Footer-Global-Lite` allows only the customizing of links in the first column because it is intended as a streamlined component where full footer information is not needed.```

### Custom Header

You have the option to add a custom column header to the first column in both `Footer-Global` and `Footer-Global-Lite`. This could be terms like Quick Links, About, or the applications name. 

- Add "custom" as an attribute to the extended html element. This helps with column spacing and is needed.
- Define the text as an attribute.

```<footer-global
    custom
    header="Your Application Name">```

### Custom Links Column 1

The first column is reserved for custom links.

### Examples

Here's an example of how to use the `FooterGlobal` component in an HTML file:

```html
   <footer-global>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 1</a>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 2</a>
    <a slot="custom-links" class="custom-footer-link" href="#">Custom Link 3</a>
  </footer-global>
```

### Debugging

There are some commented out lines for console logging if the custom content is not displaying. These are there to make sure the custom content is being called properly, in the right order. 

These console logs can be turned on at the component level to help with troubleshooting any issues that arise. 


### Conclusion

The `FooterGlobal` component simplifies the creation of a library branded footer.

