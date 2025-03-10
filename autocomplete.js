class AutocompleteData extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.ignoreCase = false;
    }
  
    static get observedAttributes() {
      return ['ignore-case'];
    }
  
    attributeChangedCallback(name, old, newVal) {
      if (name === 'ignore-case') {
        this.ignoreCase = newVal !== null;
      }
    }
  
    connectedCallback() {
      this.inputElement = document.getElementById(this.getAttribute('for'));
      this.suggestions = this.querySelector('data').textContent.trim().split('\n');
  
      this.inputElement.addEventListener('input', this.handleInput.bind(this));
      this.inputElement.addEventListener('keydown', this.handleKeydown.bind(this));
  
      this.render();
    }
  
    handleInput() {
      const query = this.inputElement.value;
      this.filterSuggestions(query);
    }
  
    handleKeydown(event) {
      switch (event.key) {
        case 'Escape':
          this.closeSuggestions();
          break;
        case 'ArrowUp':
          this.navigateSuggestions(-1);
          break;
        case 'ArrowDown':
          this.navigateSuggestions(1);
          break;
        case 'Enter':
          this.selectSuggestion();
          break;
      }
    }
  
    filterSuggestions(query) {
      const filtered = this.suggestions.filter(suggestion => {
        if (this.ignoreCase) {
          return suggestion.toLowerCase().includes(query.toLowerCase());
        }
        return suggestion.includes(query);
      });
      this.renderSuggestions(filtered);
    }
  
    renderSuggestions(suggestions) {
      this.shadowRoot.innerHTML = '';
      if (suggestions.length > 0) {
        const list = document.createElement('ul');
        suggestions.forEach((suggestion, index) => {
          const item = document.createElement('li');
          item.textContent = suggestion;
          item.addEventListener('click', () => this.selectSuggestion(index));
          list.appendChild(item);
        });
        this.shadowRoot.appendChild(list);
      }
    }
  
    navigateSuggestions(direction) {
      const items = this.shadowRoot.querySelectorAll('li');
      const currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
      let newIndex = currentIndex + direction;
  
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;
  
      items.forEach((item, index) => {
        item.classList.toggle('selected', index === newIndex);
      });
  
      items[newIndex].scrollIntoView({ block: 'nearest' });
    }
  
    selectSuggestion(index) {
      const items = this.shadowRoot.querySelectorAll('li');
      if (index === undefined) {
        const selectedItem = Array.from(items).find(item => item.classList.contains('selected'));
        if (selectedItem) {
          this.inputElement.value = selectedItem.textContent;
        }
      } else {
        this.inputElement.value = items[index].textContent;
      }
      this.closeSuggestions();
    }
  
    closeSuggestions() {
      this.shadowRoot.innerHTML = '';
    }
  
    render() {
      this.style.position = 'relative';
      this.shadowRoot.innerHTML = `
        <style>
          ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            border: 1px solid #ccc;
            max-height: 150px;
            overflow-y: auto;
            position: absolute;
            z-index: 1000;
            background-color: white;
          }
          li {
            padding: 8px;
            cursor: pointer;
          }
          li.selected {
            background-color: #ddd;
          }
        </style>
      `;
    }
  }
  
  customElements.define('autocomplete-data', AutocompleteData);
  