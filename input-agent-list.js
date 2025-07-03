/**
 * input-agent-list.js provides a web component 
 */
class InputAgentList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadStyles();
    this.renderContent();
    this.renderList();
    this.setupMutationObserver();
  }

  loadStyles() {
    const cssHref = this.getAttribute("css-href");
    if (cssHref) {
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", cssHref);
      this.shadowRoot.appendChild(link);
    } else {
      const style = document.createElement("style");
      style.textContent = `
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    padding: 8px;
                    margin-bottom: 5px;
                    background-color: #f4f4f4;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin: 4px 0;
                    box-sizing: border-box;
                }
                button {
                    margin: 4px;
                    padding: 8px;
                    cursor: pointer;
                }
            `;
      this.shadowRoot.appendChild(style);
    }
  }

  renderContent() {
    const container = document.createElement("div");
    const styleAttribute = this.getAttribute("style");
    if (styleAttribute) {
      container.setAttribute("style", styleAttribute);
    }
    container.innerHTML = `
            <ul id="agentList"></ul>
            <button id="addPerson" title="add person to this list">Add Person</button>
            <button id="addOrganization" title="add organization to the list">Add Organization</button>
        `;
    this.shadowRoot.appendChild(container);

    this.agentList = this.shadowRoot.querySelector("#agentList");
    this.shadowRoot.getElementById("addPerson").addEventListener(
      "click",
      () => this.addAgent("person"),
    );
    this.shadowRoot.getElementById("addOrganization").addEventListener(
      "click",
      () => this.addAgent("organization"),
    );
  }

  renderList() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        this.agentList.innerHTML = "";
        parsedContent.forEach((agent, index) => {
          const li = document.createElement("li");
          const styleAttribute = this.getAttribute("style");
          if (styleAttribute) {
            li.setAttribute("style", styleAttribute);
          }
          if (
            agent.family_name !== undefined || agent.given_name !== undefined ||
            agent.orcid != undefined
          ) {
            li.innerHTML = `
                            <div>
                                <input type="text" placeholder="Family Name" title="Family Name" value="${
              agent.family_name || ""
            }" data-index="${index}" data-field="family_name" style="${styleAttribute}">
                                <input type="text" placeholder="Given Name" title="Giveny Name" value="${
              agent.given_name || ""
            }" data-index="${index}" data-field="given_name" style="${styleAttribute}">
                                <input type="text" pattern="^(?:https:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]$|^(?:https:\/\/orcid\.org\/)?(\d{4}-){3}\d{3}[\dX]$
" placeholder="ORCID" title="ORCID" value="${
              agent.orcid || ""
            }" data-index="${index}" data-field="orcid" style="${styleAttribute}">
                            </div>
                            <button class="removeAgent" title="remove this person from list" data-index="${index}" style="${styleAttribute}">Remove</button>
                        `;
          } else {
            li.innerHTML = `
                            <div>
                                <input type="text" placeholder="Organization Name" title="Organization name" value="${
              agent.name || ""
            }" data-index="${index}" data-field="name" style="${styleAttribute}">
                                <input type="text" pattern="^(?:https:\/\/ror\.org\/)?0[a-hj-km-np-tv-z0-9]{6}[0-9]{2}$" placeholder="ROR" title="ROR" value="${
              agent.ror || ""
            }" data-index="${index}" data-field="ror" style="${styleAttribute}">
                            </div>
                            <button class="removeAgent" title="remove this organizaiton from list" data-index="${index}" style="${styleAttribute}">Remove</button>
                        `;
          }
          this.agentList.appendChild(li);
        });

        this.setupEventListeners();
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }

  setupMutationObserver() {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      this.handleJsonChange({ target: textarea });

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            this.handleJsonChange({ target: textarea });
          }
        });
      });

      const config = { characterData: true, childList: false, subtree: true };
      observer.observe(textarea, config);
    }
  }

  handleJsonChange(event) {
    if (event.target.value !== "") {
      try {
        const jsonContent = event.target.value;
        const parsedContent = JSON.parse(jsonContent);
        console.log("Parsed JSON:", parsedContent);
        // Add your logic to handle the parsed content here
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", this.handleInputChange.bind(this));
      input.addEventListener("input", this.validateInput.bind(this));
    });

    this.shadowRoot.querySelectorAll(".removeAgent").forEach((button) => {
      button.addEventListener("click", this.handleRemoveAgent.bind(this));
    });
  }

  validateInput(event) {
    const input = event.target;
    const isValid = input.checkValidity();

    if (input.hasAttribute('pattern')) {
        if (isValid) {
            input.style.borderColor = 'green';
        } else {
            input.style.borderColor = 'red';
        }
    }
  }

  handleInputChange(event) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);
        const index = event.target.getAttribute("data-index");
        const field = event.target.getAttribute("data-field");

        parsedContent[index][field] = event.target.value;
        textarea.value = JSON.stringify(parsedContent, null, 2);
      } catch (e) {
        console.error("Error updating JSON:", e);
      }
    }
  }

  handleRemoveAgent(event) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const index = event.target.getAttribute("data-index");
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);

        parsedContent.splice(index, 1);
        textarea.value = JSON.stringify(parsedContent, null, 2);
        this.renderList();
      } catch (e) {
        console.error("Error removing agent:", e);
      }
    }
  }

  addAgent(type) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      if (textarea.value === "") {
        textarea.value = "[]";
      }
      try {
        const jsonContent = textarea.value;
        const parsedContent = JSON.parse(jsonContent);

        if (type === "person") {
          parsedContent.push({
            "family_name": "",
            "given_name": "",
            "orcid": "",
          });
        } else if (type === "organization") {
          parsedContent.push({
            "name": "",
            "ror": "",
          });
        }

        textarea.value = JSON.stringify(parsedContent, null, 2);
        this.renderList();
      } catch (e) {
        console.error("Error adding agent:", e);
      }
    }
  }
}

customElements.define("input-agent-list", InputAgentList);
