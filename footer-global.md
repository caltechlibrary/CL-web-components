# Footer Global & Footer Global Lite

This web component adds a branded footer to applications maintained by the library.

## Versions

There are two versions of the footer:

- **Footer Global**: Standard footer matching the library website with full customization options
- **Footer Global Lite**: Streamlined footer with simplified content structure

## Key Features

- **Automatic Updates**: Once installed, the component automatically receives updates when new versions are released
- **Preset Configurations**: Use `library` or `archives` presets for instant setup with common defaults
- **Full Customization**: Override any preset value or create completely custom configurations
- **Flexible Content**: Custom headings, links, contact info, social media, and branding options
- **Library-Specific Features**: Optional breadcrumbs and login links for LibGuides integration

## Installing

### Footer Global

```html
<!-- Add the component -->
<footer-global></footer-global>

<!-- Include the JavaScript -->
<script type="module" src="https://media.library.caltech.edu/cl-webcomponents/footer-global.js"></script>
```

### Footer Global Lite

```html
<!-- Add the component -->
<footer-global-lite></footer-global-lite>

<!-- Include the JavaScript -->
<script type="module" src="https://media.library.caltech.edu/cl-webcomponents/footer-global-lite.js"></script>
```

## Quick Start with Presets

The easiest way to use the footer is with preset configurations. Simply add the `library` or `archives` attribute to automatically configure all contact information, branding, and social media links.

### Library Preset

```html
<footer-global library></footer-global>
```

**Default Values:**
- Email: library@caltech.edu
- Phone: 626-395-3405
- Library Name: Caltech Library
- Mail Code: Mail Code 1-43
- Logo: Library logo
- Instagram: @caltechlibrary
- YouTube: Caltech Library channel

### Archives Preset

```html
<footer-global archives></footer-global>
```

**Default Values:**
- Email: archives@caltech.edu
- Phone: (626) 395-2704
- Library Name: Caltech Library<br>Archives & Special Collections
- Mail Code: Mail Code B215A-74
- Logo: Archives logo
- Instagram: @caltecharchives
- YouTube: Caltech Library channel

### Overriding Preset Values

You can use a preset and override specific values:

```html
<footer-global archives phone="626-555-1234">
  <a slot="custom-links" class="custom-links" href="/about">About</a>
  <a slot="custom-links" class="custom-links" href="/contact">Contact</a>
</footer-global>
```

## Full Customization

For department-specific footers or unique configurations, use the `custom` attribute to take full control over the first column.

> **Note**: The customization examples below use `footer-global`, but the same attributes work for `footer-global-lite`. The only difference is the component name.

### Understanding the `custom` Attribute

The `custom` attribute is a special flag that:
- **Hides the default library hours content** in column 1
- **Hides the "Hours" heading** (unless you provide a custom `header` attribute)
- **Adjusts column widths** for better layout with custom content

**Behavior:**
- `<footer-global>` → Shows "Hours" heading + library hours
- `<footer-global custom>` → Column 1 is completely empty (no heading, no hours)
- `<footer-global custom header="Links">` → Shows "Links" heading, no hours

This gives you a clean slate to add your own content without the default library hours appearing.

### Custom Heading

Add a custom heading to the first column:

```html
<footer-global
  custom
  header="Digital Collections">
</footer-global>
```

> **Tip**: If you don't provide a `header` attribute, the heading will be hidden entirely, giving you maximum flexibility for your custom content.

### Custom Links in First Column

The first column displays custom links specific to your application.

**Default Content (without customization):**
- Footer Global: Library Hours
- Footer Global Lite: Default links for Home and Return to Top

**To add custom links:**

```html
<footer-global
  custom
  header="Quick Links">

  <a slot="custom-links" class="custom-links" href="/about">About</a>
  <a slot="custom-links" class="custom-links" href="/help">Help</a>
  <a slot="custom-links" class="custom-links" href="/contact">Contact</a>

</footer-global>
```

**Required attributes on each link:**
- `slot="custom-links"` - Pulls content into Shadow DOM
- `class="custom-links"` - Applies proper styling and hover states

### Custom Phone and Email

Override the default contact information:

```html
<footer-global
  custom
  header="Digital Collections"
  phone="626-555-0100"
  email="digcoll@caltech.edu">

  <a slot="custom-links" class="custom-links" href="/about">About</a>

</footer-global>
```

### Custom Social Media Links

Customize Instagram, YouTube, and RSS links (Footer Global only):

**Default behavior:**
- Instagram and YouTube default to library profiles
- RSS has no default; icon only appears if URL is provided

```html
<footer-global
  custom
  header="Your Application"
  instagram="https://instagram.com/yourprofile"
  youtube="https://youtube.com/yourchannel"
  rss="https://yoursite.edu/feed">

  <a slot="custom-links" class="custom-links" href="#">Link 1</a>

</footer-global>
```

### Custom Library Name and Link

Change the library name and where it links to (Footer Global only):

**Default:** "Caltech Library" linking to https://library.caltech.edu/

```html
<footer-global
  custom
  library-name="Special Collections"
  library-link="https://library.caltech.edu/special-collections">
</footer-global>
```

**For multi-line library names**, use `<br>` in the value:

```html
<footer-global
  custom
  library-name="Caltech Library<br>Special Collections">
</footer-global>
```

### Custom Mail Code

Override the mail code while keeping the standard Caltech address (Footer Global only):

**Default:** Library mail code (Mail Code 1-43)

**Address (always the same):** 1200 E California Blvd, Pasadena, CA 91125-4300

```html
<footer-global
  custom
  mail-code="Mail Code 555-01">
</footer-global>
```

### Custom Logo

Switch between library and archives branding:

```html
<!-- Library logo (default) -->
<footer-global logo="library"></footer-global>

<!-- Archives logo -->
<footer-global logo="archives"></footer-global>
```

## Library Website-Specific Features

These features are designed specifically for LibGuides and library website integration.

### LibGuides Login Link

Adds a staff login link to the bottom right of the footer:

```html
<footer-global
  library
  libguides-login="true">
</footer-global>
```

**Requirements:**
- Page must have element with `id="s-lib-footer-login-link"` containing the login link
- The footer will mirror this link into the component

### Breadcrumbs

Displays LibGuides breadcrumb navigation in the footer:

```html
<footer-global
  library
  breadcrumbs="true">
</footer-global>
```

**Requirements:**
- Page must have breadcrumb navigation with `id="s-lib-bc"`
- The footer will clone this breadcrumb trail into the component
- Breadcrumbs automatically align with the first column

## Complete Example

Here's a fully customized footer using all available options:

```html
<footer-global
  custom
  header="Digital Collections"
  phone="626-555-0100"
  email="digcoll@caltech.edu"
  instagram="https://instagram.com/yourprofile"
  youtube="https://youtube.com/yourchannel"
  rss="https://yoursite.edu/feed"
  library-name="Caltech Library<br>Digital Collections"
  library-link="https://library.caltech.edu/digital"
  mail-code="Mail Code DC-123"
  logo="library"
  libguides-login="true"
  breadcrumbs="true">

  <a slot="custom-links" class="custom-links" href="/about">About</a>
  <a slot="custom-links" class="custom-links" href="/browse">Browse</a>
  <a slot="custom-links" class="custom-links" href="/search">Search</a>
  <a slot="custom-links" class="custom-links" href="/help">Help</a>

</footer-global>
```

## Debugging

The component includes console logging for troubleshooting. Messages include:

- 🪶 Custom content detection
- 🔗 Breadcrumb mirroring status
- ℹ️ Element not found warnings
- 🧪 LibGuides feature activation

Check your browser's developer console for these messages if content isn't displaying as expected.

## Attribute Reference

| Attribute | Values | Applies To | Description |
|-----------|--------|------------|-------------|
| `library` | boolean | Both | Use library preset configuration |
| `archives` | boolean | Both | Use archives preset configuration |
| `custom` | boolean | Both | Hide default hours and heading; enable full column 1 customization |
| `header` | string | Both | Custom heading for first column (use with `custom`) |
| `phone` | string | Both | Contact phone number |
| `email` | string | Both | Contact email address |
| `library-name` | string (HTML allowed) | Global | Library/department name |
| `library-link` | URL | Global | Library/department website |
| `mail-code` | string | Global | Caltech mail code |
| `instagram` | URL | Global | Instagram profile URL |
| `youtube` | URL | Global | YouTube channel URL |
| `rss` | URL | Global | RSS feed URL |
| `logo` | `library` or `archives` | Both | Logo variant |
| `libguides-login` | `"true"` | Global | Show staff login link |
| `breadcrumbs` | `"true"` | Global | Show breadcrumb navigation |

## Slots

| Slot Name | Description |
|-----------|-------------|
| `custom-links` | Links for the first column (remember to add `class="custom-links"`) |
