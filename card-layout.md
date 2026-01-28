# Card Layout

A three-card layout component for displaying featured content with images, titles, descriptions, and links.

[View Demo](demo_card-layout.html)

## Key Features

- **Fixed Three-Card Layout**: Displays exactly three cards in a responsive flexbox row
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

## Adding Images

Add images to each card using the `card[1-3]-image` attributes:

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
| `card[1-3]-image` | URL for the card image | Placeholder shown |
| `card[1-3]-title` | Card heading text | "Card One/Two/Three" |
| `card[1-3]-description` | Brief description text | "Add your content here." |
| `card[1-3]-link` | URL for the link | Link hidden if not set |
| `card[1-3]-link-text` | Custom text for the link | "Read more" |

Replace `[1-3]` with the card number (1, 2, or 3).

## Responsive Behavior

- **Desktop**: Cards display in a horizontal row with equal widths
- **Mobile** (< 600px): Cards stack vertically, each taking full width

The component handles this automatically with no additional configuration needed.
