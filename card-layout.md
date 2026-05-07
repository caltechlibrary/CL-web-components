# Card Layout

A three-card layout component for displaying featured content with images, titles, descriptions, and links.

[View Demo](demo_card-layout.html)

## Key Features

- **Fixed Three-Card Layout**: Displays exactly three cards in a responsive flexbox row
- **Horizontal or Vertical Layout**: Choose between side-by-side or stacked card arrangement
- **Attribute-Based Content**: Configure each card via simple HTML attributes
- **Responsive Design**: Cards stack automatically on smaller screens
- **Encapsulated Styles**: Shadow DOM prevents style conflicts with your page
- **Automatic Updates**: Once installed, the component receives updates when new versions are released

## Installing

```html
<!-- Add the component -->
<card-layout
  card1-title="Card One"
  card1-description="Your description here."
  card1-link="/page1"

  card2-title="Card Two"
  card2-description="Another description."
  card2-link="/page2"

  card3-title="Card Three"
  card3-description="Third description."
  card3-link="/page3"
></card-layout>

<!-- Include the JavaScript -->
<script type="module" src="https://media.library.caltech.edu/cl-webcomponents/card-layout.js"></script>
```

## Basic Usage

At minimum, provide a title and description for each card:

```html
<card-layout
  card1-title="Sherman Fairchild Library"
  card1-description="Study spaces, course reserves, and technology lending."
  card1-link="https://library.caltech.edu/locations/sfl"

  card2-title="Caltech Archives"
  card2-description="Explore Caltech's rich history and scientific legacy."
  card2-link="https://library.caltech.edu/archives"

  card3-title="Research Support"
  card3-description="Get help with data management, publishing, and more."
  card3-link="https://library.caltech.edu/publish"
></card-layout>
```

When no image is provided, a placeholder is displayed.

## Layout Options

By default, cards display horizontally in a row. Use the `layout` attribute to switch to a vertical stacked layout:

```html
<!-- Horizontal layout (default) -->
<card-layout
  card1-title="Card One"
  card1-description="First card."
  card2-title="Card Two"
  card2-description="Second card."
  card3-title="Card Three"
  card3-description="Third card."
></card-layout>

<!-- Vertical layout (image left, content right) -->
<card-layout
  layout="vertical"
  card1-image="https://example.com/image1.jpg"
  card1-title="Card One"
  card1-description="First card description here."
  card1-link="/page1"
  card2-image="https://example.com/image2.jpg"
  card2-title="Card Two"
  card2-description="Second card description here."
  card2-link="/page2"
  card3-image="https://example.com/image3.jpg"
  card3-title="Card Three"
  card3-description="Third card description here."
  card3-link="/page3"
></card-layout>
```

The vertical layout displays cards stacked on top of each other, with each card showing the image on the left and the title, description, and link on the right. This is useful for listing items or displaying priority content.

## Adding Images

Add images to each card using the `card[1-3]-image` attributes. Images are automatically scaled and cropped to fit the card layout, so you don't need exact dimensions.

**Image sizing notes:**
- Images are scaled using `object-fit: cover`, which crops to fit while maintaining aspect ratio
- For horizontal layout, use images at least 400px wide
- For vertical layout, images display at 120px × 100px, so 200px+ wide works well
- Landscape orientation recommended; keep important content centered as edges may be cropped

```html
<card-layout
  card1-image="https://example.com/image1.jpg"
  card1-title="Digital Collections"
  card1-description="Browse digitized rare books, photographs, and manuscripts."
  card1-link="https://library.caltech.edu/archives/collections"

  card2-image="https://example.com/image2.jpg"
  card2-title="Workshops & Events"
  card2-description="Join us for research skills workshops and special events."
  card2-link="https://library.caltech.edu/events"

  card3-image="https://example.com/image3.jpg"
  card3-title="Course Reserves"
  card3-description="Access textbooks and materials for your courses."
  card3-link="https://library.caltech.edu/borrow/reserves"
></card-layout>
```

### Image Alt Text

For accessibility, you can provide custom alt text for each image using `card[1-3]-alt`. If not specified, the card title is used as the alt text.

```html
<card-layout
  card1-image="https://example.com/library-interior.jpg"
  card1-alt="Students studying at tables in the Sherman Fairchild Library reading room"
  card1-title="Study Spaces"
  card1-description="Find quiet study areas and group collaboration rooms."
  card1-link="/spaces"

  card2-image="https://example.com/archives-photo.jpg"
  card2-alt="Historical photograph of Caltech's Throop Hall circa 1920"
  card2-title="Caltech Archives"
  card2-description="Explore Caltech's rich history."
  card2-link="/archives"

  card3-image="https://example.com/workshop.jpg"
  card3-alt="Librarian presenting research tools to a group of graduate students"
  card3-title="Workshops"
  card3-description="Learn new research skills."
  card3-link="/workshops"
></card-layout>
```

## Custom Link Text

By default, links display "Read more". Customize with `card[1-3]-link-text`:

```html
<card-layout
  card1-title="Digital Collections"
  card1-description="Browse our digitized materials."
  card1-link="https://library.caltech.edu/archives/collections"
  card1-link-text="Explore collections"

  card2-title="Workshops & Events"
  card2-description="Join us for upcoming events."
  card2-link="https://library.caltech.edu/events"
  card2-link-text="View calendar"

  card3-title="Course Reserves"
  card3-description="Access course materials."
  card3-link="https://library.caltech.edu/borrow/reserves"
  card3-link-text="Find reserves"
></card-layout>
```

## Hiding Links

If you don't provide a `card[1-3]-link` attribute, the link will be hidden for that card:

```html
<card-layout
  card1-title="Information Only"
  card1-description="This card has no link."

  card2-title="With Link"
  card2-description="This card has a link."
  card2-link="/some-page"

  card3-title="Also No Link"
  card3-description="Another card without a link."
></card-layout>
```

## Complete Example

Here's a fully configured card layout using all available options:

```html
<card-layout
  card1-image="https://example.com/collections.jpg"
  card1-title="Digital Collections"
  card1-description="Browse digitized rare books, photographs, and manuscripts from Caltech's history."
  card1-link="https://library.caltech.edu/archives/collections"
  card1-link-text="Explore collections"

  card2-image="https://example.com/events.jpg"
  card2-title="Workshops & Events"
  card2-description="Join us for research skills workshops, author talks, and special events."
  card2-link="https://library.caltech.edu/events"
  card2-link-text="View calendar"

  card3-image="https://example.com/reserves.jpg"
  card3-title="Course Reserves"
  card3-description="Access textbooks, readings, and other materials for your courses."
  card3-link="https://library.caltech.edu/borrow/reserves"
  card3-link-text="Find reserves"
></card-layout>
```

## Attribute Reference

| Attribute | Description | Default |
|-----------|-------------|---------|
| `layout` | Card arrangement: `horizontal` or `vertical` | `horizontal` |
| `card[1-3]-image` | URL for the card image | Placeholder shown |
| `card[1-3]-alt` | Alt text for the card image (for accessibility) | Uses card title |
| `card[1-3]-title` | Card heading text | "Card One/Two/Three" |
| `card[1-3]-description` | Brief description text | "Add your content here." |
| `card[1-3]-link` | URL for the link | Link hidden if not set |
| `card[1-3]-link-text` | Custom text for the link | "Read more" |

Replace `[1-3]` with the card number (1, 2, or 3).

## Responsive Behavior

- **Horizontal layout (default)**: Cards display side-by-side in a row on desktop, stacking vertically on mobile (< 600px). Each card shows the image above the content.
- **Vertical layout**: Cards stack vertically with image on the left and content on the right. Each card spans the full width of the container.

The component handles responsive behavior automatically with no additional configuration needed.
