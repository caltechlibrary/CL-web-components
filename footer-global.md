# Footer Global & Footer Global Lite

This web component is designed to add a branded footer to applications maintained by the library. 

There are two versions of the footer - the standard footer that matches the library website, and a lite version with a streamlined content structure. 

The footers have several options for customization using both attributes and slot to change the content that is displayed.

## Key Features

Once added to an application, the component will get updates automatically whenever a new version is released. This allows a streamlined way to update the footer and have those changes immediately reflected on all applications calling it.

The component has several options for customization, including:

- Custom column heading (full & lite)
- Application-specific links (full & lite)
- Configurable contact information (full & lite)
- Customizable social media links (full only)
- The ability to change the logo version between archives and the library (full & lite)

## Installing

To install the footer, simply included the javascript file and the extended html element as such:

### Global-Footer

```html
<footer-global></footer-global>
```
 
 And the javascript file.

```html
<script type="module" src="https://media.library.caltech.edu/cl-webcomponents/footer-global.js"></script> 
```
### Global-Footer-Lite

```html
<footer-global-lite></footer-global-lite>
```
 
 And the javascript file.

```html
<script type="module" src="/src/footer-global-lite.js"></script> (updated link coming soon)
```

## Customizing

There are multiple ways to customize the footers. 

> **Please Note**: There are no differences between Footer-Global and Footer-Global-Lite when customizing content, other than the name of the extended html element. The first example shows how to customize both footer versions but all following examples will only reference Footer-Global for brevity.

### Custom Heading

You have the option to add a custom column heading to the first column in both Footer-Global and Footer-Global-Lite. This could be terms like Quick Links, About, or the application's name. 

1) Add "custom" as an attribute to the extended html element. This helps with column spacing and is required anytime you customize the component.
2) Define the heading text as an attribute.

```html
<footer-global
    custom
    header="Your Application Name">
</footer-global>
```

or

```html
<footer-global-lite
    custom
    header="Your Application Name">
</footer-global-lite>
```

### Custom Links First Column

The first column is reserved for custom links specific to the application in both Footer-Global and Footer-Global-Lite. 

The default content without customization:
- Footer-Global: Library Hours
- Footer-Global-Lite: Default links for Home and Return to Top.

To overwrite this default content, you will

1) First, add an ```<a>``` tag between the open and close of the footer element with your custom link.
2) Add the named slot **custom-links** to the ```<a>``` tag. This will pull the content into the Shadow Dom.
3) Add the class **custom-links** to the ```<a>``` tag. This will give it the link style it needs and account for hover states.


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

In the second column, you can change the phone and email so that it is specific to your application in both Footer-Global and Footer-Global-Lite. 

To override the phone and email, you will define their attributes in the html element.

1) Add ```Phone="xxx-xxxx"``` to change the phone.
2) Add ```Email="email@test.com"``` to change the email.

```html
<footer-global
    custom
    header="Your Application Name"
    phone="xxx-xxxx"
    email="email@test.com"> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Custom Social Media Links 

In the second column, you can also customize the social media links in the Footer-Global component. Currently, the component only supports Instagram and YouTube. To add more social links, please contact the developers of this component. You will customize these by defining an attribute in the html element. 

1) Add ```instagram="your-profile-url"```
2) Add ```youtube="your-profile-url"```

```html
<footer-global
    custom
    header="Your Application Name"
    phone="xxxxxx"
    email="email@test.com"
    instagram="your-profile-url"
    youtube="your-profile-url"> 
    
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 1</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 2</a>
      <a slot="custom-links" class="custom-links" aria-label="footer navigation" href="#">Custom Link 3</a> 

</footer-global>
```

### Custom Logo

In the last column, you can use attributes to switch between the library or the archives logo by defining an attribute in the html element. If no logo is defined, it will default to the library logo. 

- Add ```logo="library"``` (or leave off for same results)
- Add ```logo="archives"```

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

These console logs can be turned on at the component level to help with troubleshooting any issues that arise. Please feel free to make a comit to the repo to turn these off and on as needed. 

### Potential Enhancements

1) Using a single attribute when calling the component that switches between a library and an archives version of the footer. 



