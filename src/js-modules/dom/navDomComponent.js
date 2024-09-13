import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
} from "../../js-utilities/commonDomComponents.js";
import { capitalizeFirstLetter } from "../../js-utilities/commonUtilities.js";
import PubSub from "pubsub-js";
import filtersAndTagsComponent from "../logic/filtersAndTagsComponent.js";
import searchComponent from "../logic/searchComponent.js";
import { todoComponent } from "../logic/fixCircularDependenciesInComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "../uiIcons.js";

const blockName = "main-nav";
const cssClass = {
  nav: blockName,
  divPredefined: `${blockName}__div-predefined`,
  divCustomProjects: `${blockName}__div-custom-projects`,
  ul: `${blockName}__ul`,
  li: `${blockName}__li`,
  btn: `${blockName}__li-btn`,
};

export default class navDomComponent {
  constructor(root) {
    this.nav = document.createElement("nav");
    this.nav.classList.add(cssClass.nav);

    const predefinedDiv = this.#initPredefinedDiv(root);
    const projectsDiv = this.#initCustomProjectsDiv(root);

    this.nav.append(predefinedDiv, projectsDiv);
  }

  // helper methods
  #initPredefinedDiv(root) {
    const div = initDiv(cssClass.divPredefined);

    const ul = initUl(cssClass.ul);

    div.append(ul);

    // Init home project button -----------------------------------------

    this.#initItemRenderLi(
      ul,
      { title: "Home", icon: uiIcons.home },
      "GENERIC",
      null
    );

    // Init inbox project button -----------------------------------------

    this.#initItemRenderLi(ul, root.inboxProject);

    // Overdue, Today, Upcoming ------------------------------------------

    ul.append(document.createElement("hr"));

    this.#initCustomImminenceFilters(ul);

    ul.append(document.createElement("hr"));

    // Filters, tags, search ------------------------------------------------

    const filtersAndTags = new filtersAndTagsComponent({}, root);
    this.#initItemRenderLi(ul, filtersAndTags, "FILTERS AND TAGS");

    const search = new searchComponent({}, root);
    this.#initItemRenderLi(ul, search, "SEARCH");

    return div;
  }

  #initCustomImminenceFilters(ul) {
    const getImminenceFilterResults = (idx) => {
      return {
        title: capitalizeFirstLetter(todoComponent.imminenceLabels[idx]),
        icon: todoDomComponent.imminenceIcons[idx],
        variable: "imminence",
        value: idx,
      };
    };
    const imminenceIdxArr = [
      todoComponent.overdueIdx,
      todoComponent.todayIdx,
      todoComponent.upcomingIdx,
    ];
    imminenceIdxArr.forEach((idx) => {
      const resultsData = getImminenceFilterResults(idx);
      this.#initItemRenderLi(ul, resultsData, "RESULTS", {
        data: resultsData,
        parent: null,
      });
    });
  }

  #initCustomProjectsDiv(root) {
    const div = initDiv(cssClass.divCustomProjects);

    const h2 = document.createElement("h2");
    h2.textContent = "PROJECTS";
    const ul = initUl(cssClass.ul);

    div.append(h2, ul);

    // Init custom projects buttons

    root.customProjects.forEach((project) => {
      this.#initItemRenderLi(ul, project, "PROJECT");
    });

    PubSub.subscribe("ADD PROJECT", (msg, item) => {
      if (item.parent == null) {
        console.log(msg);
        this.#initItemRenderLi(ul, item, "PROJECT");
      }
    });

    return div;
  }

  #initItemRenderLi(ul, item, renderStr = "GENERIC", itemToRender = item) {
    const li = initLiAsChildInList(ul, cssClass.li);
    const btn = initButton(
      cssClass.btn,
      navDomComponent.btnRenderItemCallback,
      item.icon,
      "",
      item.title
    );
    btn.associatedItem = itemToRender;
    btn.renderStr = renderStr;
    li.appendChild(btn);
  }

  // callbacks
  static btnRenderItemCallback = (e) => {
    PubSub.publish(
      `RENDER ${e.currentTarget.renderStr}`,
      e.currentTarget.associatedItem
    );
    e.stopPropagation();
  };
}
