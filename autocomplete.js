class AutocompleteData extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.ignoreCase = false;
    this.cssHref = '';
  }

  static get observedAttributes() {
    return ['ignore-case', 'css-href'];
  }

  attributeChangedCallback(name, old, newVal) {
    if (name === 'ignore-case') {
      this.ignoreCase = newVal !== null;
    } else if (name === 'css-href') {
      this.cssHref = newVal;
      this.loadCSS(newVal);
    }
  }

  connectedCallback() {
    this.inputElement = document.querySelector(`#${this.getAttribute('for')}`);
    this.suggestions = this.querySelector('data').textContent.trim().split('\n');
    this.render();
    this.addEventListeners();
  }

  loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.shadowRoot.appendChild(link);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Default styles */
        .suggestions {
          border: 1px solid #ccc;
          max-height: 150px;
          overflow-y: auto;
        }
        .suggestion {
          padding: 8px;
          cursor: pointer;
        }
        .suggestion.highlighted {
          background-color: #ddd;
        }
      </style>
      <div class="suggestions"></div>
    `;
    this.suggestionsContainer = this.shadowRoot.querySelector('.suggestions');
  }

  addEventListeners() {
    this.inputElement.addEventListener('input', this.handleInput.bind(this));
    this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.suggestionsContainer.addEventListener('click', this.handleClick.bind(this));
  }

  handleInput() {
    const query = this.inputElement.value;
    const filteredSuggestions = this.filterSuggestions(query);
    this.renderSuggestions(filteredSuggestions);
  }

  handleKeyDown(event) {
    const highlighted = this.shadowRoot.querySelector('.suggestion.highlighted');
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateSuggestions(event.key);
    } else if (event.key === 'Enter' && highlighted) {
      event.preventDefault();
      this.acceptSuggestion(highlighted);
    } else if (event.key === 'Escape') {
      this.clearSuggestions();
    }
  }

  handleClick(event) {
    if (event.target.classList.contains('suggestion')) {
      this.acceptSuggestion(event.target);
    }
  }

  filterSuggestions(query) {
    const compare = this.ignoreCase ? (a, b) => a.toLowerCase().includes(b.toLowerCase()) : (a, b) => a.includes(b);
    return this.suggestions.filter(suggestion => compare(suggestion, query));
  }

  renderSuggestions(suggestions) {
    this.suggestionsContainer.innerHTML = '';
    suggestions.forEach((suggestion, index) => {
      const div = document.createElement('div');
      div.classList.add('suggestion');
      if (index === 0) div.classList.add('highlighted');
      div.textContent = suggestion;
      this.suggestionsContainer.appendChild(div);
    });
  }

  navigateSuggestions(direction) {
    const highlighted = this.shadowRoot.querySelector('.suggestion.highlighted');
    let nextIndex;
    if (direction === 'ArrowDown') {
      nextIndex = highlighted ? highlighted.nextSibling : this.suggestionsContainer.firstChild;
    } else if (direction === 'ArrowUp') {
      nextIndex = highlighted ? highlighted.previousSibling : this.suggestionsContainer.lastChild;
    }
    if (highlighted) highlighted.classList.remove('highlighted');
    if (nextIndex) nextIndex.classList.add('highlighted');
  }

  acceptSuggestion(element) {
    this.inputElement.value = element.textContent;
    this.clearSuggestions();
  }

  clearSuggestions() {
    this.suggestionsContainer.innerHTML = '';
  }
}

customElements.define('autocomplete-data', AutocompleteData);
