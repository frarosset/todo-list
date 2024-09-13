import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initH2,
} from "../../js-utilities/commonDomComponents.js";
import { capitalizeFirstLetter } from "../../js-utilities/commonUtilities.js";
import PubSub from "pubsub-js";
import filtersAndTagsComponent from "../logic/filtersAndTagsComponent.js";
import searchComponent from "../logic/searchComponent.js";
import { todoComponent } from "../logic/fixCircularDependenciesInComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "../uiIcons.js";
import { deleteElement } from "../../js-utilities/commonDomUtilities.js";

const blockName = "main-nav";
const cssClass = {
  nav: blockName,
  divPredefined: `${blockName}__div-predefined`,
  divCustomProjects: `${blockName}__div-custom-projects`,
  divCustomProjectsHeading: `${blockName}__div-custom-projects-heading`,
  divCustomProjectsH2: `${blockName}__div-custom-projects-h2`,
  divCustomProjectsNewBtn: `${blockName}__div-custom-projects-new-btn`,
  ul: `${blockName}__ul`,
  li: `${blockName}__li`,
  btn: `${blockName}__li-btn`,
};

export default class navDomComponent {
  #listMap; // A Map object that stores (obj, li) pairs, where obj is a reference to a project li button and used as the key, and li the dom li representing it

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
    this.#listMap = new Map();

    const div = initDiv(cssClass.divCustomProjects);

    const divHeading = initDiv(cssClass.divCustomProjectsHeading);
    const h2 = initH2(cssClass.divCustomProjectsH2, null, "PROJECTS");
    const addNewBtn = initButton(
      cssClass.divCustomProjectsNewBtn,
      navDomComponent.showDialog,
      uiIcons.new
    );
    addNewBtn.parentObj = root.customProjectsList;
    divHeading.append(h2, addNewBtn);

    const ul = initUl(cssClass.ul);

    div.append(divHeading, ul);

    // Init custom projects buttons

    root.customProjects.forEach((project) => {
      const li = this.#initItemRenderLi(ul, project, "PROJECT");
      this.#listMap.set(project, li);
    });

    PubSub.subscribe("ADD PROJECT", (msg, item) => {
      if (item.parent == null) {
        console.log(msg, `[${item.pathAndThisStr}]`);
        const li = this.#initItemRenderLi(ul, item, "PROJECT");
        this.#listMap.set(item, li);
      }
    });

    PubSub.subscribe("REMOVE PROJECT", (msg, item) => {
      const domItemLi = this.#listMap.get(item);
      if (domItemLi != null) {
        console.log(msg, `[${item.pathAndThisStr}]`);
        deleteElement(domItemLi);
        this.#listMap.delete(item, domItemLi);
      }
    });

    PubSub.subscribe("EDIT TITLE PROJECT", (msg, item) => {
      const domItemLi = this.#listMap.get(item);
      if (domItemLi != null) {
        console.log(msg, `[${item.pathAndThisStr}]`);
        domItemLi.children[0].childNodes[3].textContent = item.data.title;
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
    return li;
  }

  // callbacks
  static btnRenderItemCallback = (e) => {
    PubSub.publish(
      `RENDER ${e.currentTarget.renderStr}`,
      e.currentTarget.associatedItem
    );
    e.stopPropagation();
  };

  static showDialog(e) {
    const associatedDialog = document.body.projectFormDialog;
    if (associatedDialog != null) {
      // reset form //tofix
      associatedDialog.setObjectData(e.currentTarget.parentObj);
      associatedDialog.dialog.showModal();
    }
    e.stopPropagation();
  }
}
