import projectDomComponent from "./projectDomComponent.js";
import todoDomComponent from "./todoDomComponent.js";
import { resetContent } from "../js-utilities/commonDomUtilities.js";

export default class mainDomComponent {
  constructor() {
    this.main = document.createElement("main");
    this.renderHome();
  }

  // helper methods
  #clearMainContent() {
    resetContent(this.main);
  }

  // Render methods
  renderProject(projectObj) {
    this.#clearMainContent();
    const projectDomObj = new projectDomComponent(projectObj);
    this.main.append(projectDomObj.div);
  }

  renderTodo(todoObj) {
    this.#clearMainContent();
    const todoDomObj = new todoDomComponent(todoObj);
    this.main.append(todoDomObj.div);
  }

  renderHome() {
    // todo
    this.#clearMainContent();
    this.main.textContent = "HOME (todo)";
  }

  renderGeneric(obj) {
    if (obj == null) {
      this.renderHome();
      return;
    }

    switch (obj.type) {
      case "P":
        this.renderProject(obj);
        break;
      case "T":
        this.renderTodo(obj);
        break;
      default:
    }
  }
}
