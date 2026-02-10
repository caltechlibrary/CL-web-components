// src/card-layout.js

// Load Hind fonts outside Shadow DOM
if (!document.getElementById('hind-fonts-card')) {
  const fontStyles = document.createElement('style');
  fontStyles.id = 'hind-fonts-card';
  fontStyles.textContent = `
    @font-face {
      font-family: 'Hind';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('https://media.library.caltech.edu/cl-webcomponents/fonts/hind-400.woff') format('woff');
    }
    @font-face {
      font-family: 'Hind';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('https://media.library.caltech.edu/cl-webcomponents/fonts/hind-500.woff') format('woff');
    }
    @font-face {
      font-family: 'Hind';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('https://media.library.caltech.edu/cl-webcomponents/fonts/hind-600.woff') format('woff');
    }
  `;
  document.head.appendChild(fontStyles);
}

export class CardLayout extends HTMLElement {
  static get observedAttributes() {
    return ['layout'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        /* BASE STYLES */
        :host {
          display: block;
          font-family: 'Hind', sans-serif;
          font-size: 16px;
        }

        :host, *, *::before, *::after {
          box-sizing: border-box;
        }

        /* LAYOUT */
        .cards-container {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* VERTICAL LAYOUT */
        .cards-container.vertical {
          flex-direction: column;
        }

        .cards-container.vertical .card {
          min-width: 100%;
          flex-direction: row;
          align-items: flex-start;
        }

        .cards-container.vertical .card-image,
        .cards-container.vertical .card-image-placeholder {
          width: 120px;
          min-width: 120px;
          height: 100px;
          margin-bottom: 0;
          margin-right: 16px;
        }

        .cards-container.vertical .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* CARD STYLES */
        .card {
          flex: 1;
          min-width: 220px;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        /* CARD IMAGE */
        .card-image {
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin-bottom: 12px;
          object-fit: cover;
        }

        .card-image-placeholder {
          width: 100%;
          height: 120px;
          background: #f0f0f0;
          border-radius: 4px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.875em;
        }

        /* CARD TITLE */
        .card-title {
          margin: 0 0 8px 0;
          font-size: 1.1em;
          font-weight: 600;
          color: #333;
        }

        /* CARD CONTENT */
        .card-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        /* CARD DESCRIPTION */
        .card-description {
          margin: 0 0 12px 0;
          color: #666;
          line-height: 1.5;
          flex-grow: 1;
        }

        /* CARD LINK */
        .card-link {
          color: #008080;
          text-decoration: none;
          font-size: 0.9em;
          font-weight: 600;
        }

        .card-link:hover {
          text-decoration: underline;
        }

        .card-link:focus-visible {
          outline: 2px solid #008080;
          outline-offset: 2px;
        }

        /* RESPONSIVE */
        @media (max-width: 600px) {
          .cards-container {
            flex-direction: column;
          }

          .card {
            min-width: 100%;
          }
        }
      </style>

      <div class="cards-container">
        <div class="card" id="card1">
          <div class="card-image-placeholder">Image</div>
          <div class="card-content">
            <h3 class="card-title">Card One</h3>
            <p class="card-description">Add your content here.</p>
            <a class="card-link" href="#">Read more</a>
          </div>
        </div>

        <div class="card" id="card2">
          <div class="card-image-placeholder">Image</div>
          <div class="card-content">
            <h3 class="card-title">Card Two</h3>
            <p class="card-description">Add your content here.</p>
            <a class="card-link" href="#">Read more</a>
          </div>
        </div>

        <div class="card" id="card3">
          <div class="card-image-placeholder">Image</div>
          <div class="card-content">
            <h3 class="card-title">Card Three</h3>
            <p class="card-description">Add your content here.</p>
            <a class="card-link" href="#">Read more</a>
          </div>
        </div>
      </div>
    `;
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Apply layout
    this.applyLayout();

    // Process each of the 3 cards
    for (let i = 1; i <= 3; i++) {
      this.setupCard(i);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'layout' && oldValue !== newValue) {
      this.applyLayout();
    }
  }

  applyLayout() {
    const container = this.shadowRoot.querySelector('.cards-container');
    if (!container) return;

    const layout = this.getAttribute('layout') || 'horizontal';
    if (layout === 'vertical') {
      container.classList.add('vertical');
    } else {
      container.classList.remove('vertical');
    }
  }

  setupCard(cardNum) {
    const card = this.shadowRoot.getElementById(`card${cardNum}`);
    if (!card) return;

    const prefix = `card${cardNum}`;

    // Image
    const imageUrl = this.getAttribute(`${prefix}-image`);
    const imageContainer = card.querySelector('.card-image-placeholder, .card-image');
    if (imageUrl && imageContainer) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = this.getAttribute(`${prefix}-alt`) || this.getAttribute(`${prefix}-title`) || `Card ${cardNum}`;
      img.className = 'card-image';
      imageContainer.replaceWith(img);
    }

    // Title
    const title = this.getAttribute(`${prefix}-title`);
    const titleEl = card.querySelector('.card-title');
    if (title && titleEl) {
      titleEl.textContent = title;
    }

    // Description
    const description = this.getAttribute(`${prefix}-description`);
    const descEl = card.querySelector('.card-description');
    if (description && descEl) {
      descEl.textContent = description;
    }

    // Link
    const link = this.getAttribute(`${prefix}-link`);
    const linkText = this.getAttribute(`${prefix}-link-text`) || 'Read more';
    const linkEl = card.querySelector('.card-link');
    if (linkEl) {
      if (link) {
        linkEl.href = link;
        linkEl.textContent = linkText;
      } else {
        // Hide link if no URL provided
        linkEl.style.display = 'none';
      }
    }
  }
}

customElements.define("card-layout", CardLayout);
