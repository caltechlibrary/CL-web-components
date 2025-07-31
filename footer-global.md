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

```html
<footer-global></footer-global>
```
 
 And the javascript file.

```html
<script type="module" src="/src/footer-global.js"></script> (updated link coming soon)
```


## Customizing

There are multiple ways to customize `Footer-Global`. 

Please keep in mind, `Footer-Global-Lite` allows only the customizing of links in the first column because it is intended as a streamlined component where full footer information is not needed.

### Custom Header

You have the option to add a custom column header to the first column in both `Footer-Global` and `Footer-Global-Lite`. This could be terms like Quick Links, About, or the applications name. 

1) Add "custom" as an attribute to the extended html element. This helps with column spacing and is needed.
2) Define the text as an attribute.

```html
<footer-global
    custom
    header="Your Application Name">
</footer-global>
```

### Custom Links First Column

The first column is reserved for custom links specific to the application in both `Footer-Global` and `Footer-Global-Lite`. 

To overwrite the default content in the first column and create a list of custom application links, you will

1) First, add the a tags between the open and close of the footer element.
2) Add the named slot `custom-links` to the a tag. This will pull the content into the Shadow Dom.
3) Add the class `custom-links` to the a tag. This will give it the link style it needs and account for hover states.


```html
<footer-global
    custom
    header="Your Application Name"> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Custom Phone and Email 

In the second column, you change the phone and email so that it is specific to your application in both `Footer-Global` and `Footer-Global-Lite`. 

To override the phone and email, you will define their related attributes in the html element.

1) Add Phone="xxxxx" to change the phone.
2) Add Email="email@test.com" to change the email.

```html
<footer-global
    custom
    header="Your Application Name"
    phone="xxxxxx"
    email="email@test.com"> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Custom Social Media Links 

In the second column, you can also customize the social media links in the `Footer-Global` component. Currently, the component only supports Instagram and YouTube. To add more social links, please contact the developers of this component. You will customize these by difining an attribute in the html element. 

1) Add instagram="your-custom-url"
2) Add youtube="your-custom-url"

```html
<footer-global
    custom
    header="Your Application Name"
    phone="xxxxxx"
    email="email@test.com"
    instagram=""
    youtube=""> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Custom Logo

In the last column, you can use attributes to switch between the library or the archives logo by defining an attribute in the html element. If not logo is defined, it will default to the library logo. 

1) Add logo and define it as either "library" or "archives" depending on which one you need.

```html
<footer-global
    custom
    header="Your Application Name"
    phone="xxxxxx"
    email="email@test.com"
    instagram="your-custom-url"
    youtube="your-custom-url"
    logo="archives"> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Debugging

There are some commented out lines for console logging if the custom content is not displaying. These are there to make sure the custom content is being called properly, in the right order. 

These console logs can be turned on at the component level to help with troubleshooting any issues that arise. 


### Potential Enhancements

1) Using a single attribute when calling the element that switched between a library and an archives set of information. 



