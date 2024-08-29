import { projectDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { noteDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import resultsDomComponent from "./resultsDomComponent.js";
import resultsComponent from "../logic/resultsComponent.js";
import filtersAndTagsDomComponent from "./filtersAndTagsDomComponent.js";
import searchDomComponent from "./searchDomComponent.js";
import homeDomComponent from "./homeDomComponent.js";
import { resetContent } from "../../js-utilities/commonDomUtilities.js";
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
    PubSub.subscribe("RENDER NOTE", (msg, obj) => {
      console.log(msg);
      this.renderNote(obj);
    });
    PubSub.subscribe("RENDER RESULTS", (msg, obj) => {
      console.log(msg);
      this.renderResults(obj.data, obj.parent);
    });
    PubSub.subscribe("RENDER FILTERS AND TAGS", (msg, obj) => {
      console.log(msg);
      this.renderFiltersAndTags(obj);
    });
    PubSub.subscribe("RENDER SEARCH", (msg, obj) => {
      console.log(msg);
      this.renderSearch(obj);
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

  renderNote(noteObj) {
    this.#clearMainContent();
    const noteDomObj = new noteDomComponent(noteObj);
    this.main.append(noteDomObj.div);
  }

  renderResults(resultsData, parent = null) {
    this.#clearMainContent();
    const resultsObj = new resultsComponent(resultsData, this.root, parent);
    const resultsDomObj = new resultsDomComponent(resultsObj);
    this.main.append(resultsDomObj.div);
  }

  renderFiltersAndTags(filtersAndTagsObj) {
    this.#clearMainContent();
    const filtersAndTagsDomObj = new filtersAndTagsDomComponent(
      filtersAndTagsObj
    );
    this.main.append(filtersAndTagsDomObj.div);
  }

  renderSearch(searchObj) {
    this.#clearMainContent();
    const searchDomObj = new searchDomComponent(searchObj);
    this.main.append(searchDomObj.div);
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
      case "N":
        this.renderNote(obj);
        break;
      case "F":
        this.renderFiltersAndTags(obj);
        break;
      case "S":
        this.renderSearch(obj);
        break;
      default:
    }
  }
}
