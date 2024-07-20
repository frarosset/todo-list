import projectDomComponent from "./projectDomComponent.js";
import todoDomComponent from "./todoDomComponent.js";
import { resetContent } from "../js-utilities/commonDomUtilities.js";

export default class mainDomComponent {
  constructor() {
    this.main = document.createElement("main");
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
}
