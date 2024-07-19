import projectDomComponent from "./projectDomComponent.js";
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
}
