// ---------- UI COMPONENT ----------
class Dropdown {
  constructor(selector, options) {
    this.element = document.querySelector(selector);
    this.options = options || [];
    this.isOpen = false;
    this.selectedOption = null;
    this.init();
  }

  init() {
    this.render();
    this.addEventListeners();
  }

  render() {
    // Create dropdown HTML
    const html = `
      <div class="dropdown">
        <div class="dropdown-selected">${
          this.selectedOption || "Select an option"
        }</div>
        <div class="dropdown-menu" style="display: none;">
          ${this.options
            .map((option) => `<div class="dropdown-item">${option}</div>`)
            .join("")}
        </div>
      </div>
    `;
    this.element.innerHTML = html;

    // Store references to elements
    this.dropdownElement = this.element.querySelector(".dropdown");
    this.selectedElement = this.element.querySelector(".dropdown-selected");
    this.menuElement = this.element.querySelector(".dropdown-menu");
  }

  addEventListeners() {
    this.selectedElement.addEventListener("click", () => this.toggle());
    this.menuElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("dropdown-item")) {
        this.select(e.target.textContent);
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.menuElement.style.display = this.isOpen ? "block" : "none";
  }

  select(option) {
    this.selectedOption = option;
    this.selectedElement.textContent = option;
    this.toggle();
  }
}

const dropdown = new Dropdown("#myDropdown", [
  "Option 1",
  "Option 2",
  "Option 3",
]);

// ---------- DATA MODEL ----------
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || "";
    this.email = data.email || "";
    this.createdAt = data.createdAt || new Date();
  }

  validate() {
    if (!this.username) throw new Error("Username is required");
    if (!this.email.includes("@")) throw new Error("Invalid email");
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  static fromJSON(json) {
    return new User(json);
  }
}

const user = new User({
  username: "john_doe",
  email: "john@example.com",
});

console.log(user.validate()); // true
console.log(user.toJSON());

// ---------- STATE MANAGEMENT ----------
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  getState() {
    return this.state;
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

// Usage example
const store = new Store({ count: 0 });
const unsubscribe = store.subscribe((state) => {
  console.log("State updated:", state);
});

store.setState({ count: 1 }); // logs: State updated: { count: 1 }
unsubscribe(); // Remove listener