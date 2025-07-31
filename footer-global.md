
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

