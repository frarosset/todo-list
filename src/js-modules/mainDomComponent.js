import projectDomComponent from "./projectDomComponent.js";
import todoDomComponent from "./todoDomComponent.js";
import homeDomComponent from "./homeDomComponent.js";
import { resetContent } from "../js-utilities/commonDomUtilities.js";
import PubSub from "pubsub-js";

export default class mainDomComponent {
  constructor(root) {
    this.main = document.createElement("main");
    this.root = root;
    this.renderHome();

    PubSub.subscribe("RENDER GENERIC", (msg, obj) => {
      console.log(msg);
      this.renderGeneric(obj);
    });
    PubSub.subscribe("RENDER PROJECT", (msg, obj) => {
      console.log(msg);
      this.renderProject(obj);
    });
    PubSub.subscribe("RENDER TODO", (msg, obj) => {
      console.log(msg);
      this.renderTodo(obj);
    });
  }

  // helper methods
  #clearMainContent() {
    this.#resetPubSubTokens();
    resetContent(this.main);
  }

  #resetPubSubTokens() {
    // unsubscribe from all the subscription in the 'main' topic
    PubSub.unsubscribe("main:");
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
    this.#clearMainContent();
    const homeDomObj = new homeDomComponent(this.root);
    this.main.append(homeDomObj.div);
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
