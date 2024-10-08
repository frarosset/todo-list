import {
  initDiv,
  initH2,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import { capitalizeFirstLetter } from "../../js-utilities/commonUtilities.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";
import { projectListDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import filtersAndTagsComponent from "../logic/filtersAndTagsComponent.js";
import filtersAndTagsDomMiniNavComponent from "./filtersAndTagsDomMiniNavComponent.js";
import searchComponent from "../logic/searchComponent.js";
import searchDomMiniNavComponent from "./searchDomMiniNavComponent.js";
import { todoComponent } from "../logic/fixCircularDependenciesInComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import resultsComponent from "../logic/resultsComponent.js";
import resultsDomListComponent from "./resultsDomListComponent.js";
import resultsDomMiniNavComponent from "./resultsDomMiniNavComponent.js";

import { uiIcons } from "../uiIcons.js";

export default class homeDomComponent {
  static blockName = "home-div";

  static cssClass = {
    header: `header`,
    content: `content`,
    contentCol1: `content-col-1`,
    contentCol2: `content-col-2`,
    path: `path`,
    titleH2: `title-h2`,
    titleIcon: "title-icon",
    imminenceResults: `imminence-results`,
  };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  constructor(root) {
    this.init(root);
  }

  // init method
  init(root) {
    this.div = initDiv(this.constructor.blockName);
    this.div.appendChild(this.initHeader());
    this.div.appendChild(this.initContent(root));
  }

  initHeader() {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    const path = initP(this.getCssClass("path"), uiIcons.home, "", "");
    const icon = initP(this.getCssClass("titleIcon"), uiIcons.home);
    const h2 = initH2(this.getCssClass("titleH2"), null, "Home");

    header.append(path, icon, h2);
    return header;
  }

  initContent(root) {
    const contentDiv = initDiv(this.getCssClass("content"));
    const contentDivCol1 = initDiv(this.getCssClass("contentCol1"));
    const contentDivCol2 = initDiv(this.getCssClass("contentCol2"));

    const inboxDom = new projectDomMiniNavComponent(root.inboxProject);

    const imminenceResults = this.initCustomImminenceFilters(root);

    const filtersAndTags = new filtersAndTagsComponent({}, root);
    const filtersAndTagsDomMiniNav = new filtersAndTagsDomMiniNavComponent(
      filtersAndTags
    );

    const search = new searchComponent({}, root);
    const searchDomMiniNav = new searchDomMiniNavComponent(search);

    const projectListDom = new projectListDomComponent(
      root.customProjectsList,
      false //hide path
    );

    contentDiv.append(contentDivCol1, contentDivCol2);
    contentDivCol1.append(
      inboxDom.div,
      ...imminenceResults // it's an array of divs
    );
    contentDivCol2.append(
      filtersAndTagsDomMiniNav.div,
      searchDomMiniNav.div,
      projectListDom.div
    );

    return contentDiv;
  }

  initCustomImminenceFilters(root) {
    const imminenceResults = [];
    const getImminenceFilterResults = (idx) => {
      return new resultsComponent(
        {
          title: capitalizeFirstLetter(todoComponent.imminenceLabels[idx]),
          icon: todoDomComponent.imminenceIcons[idx],
          variable: "imminence",
          value: idx,
        },
        root
      );
    };
    const imminenceIdxArr = [
      todoComponent.overdueIdx,
      todoComponent.todayIdx,
      todoComponent.upcomingIdx,
    ];
    imminenceIdxArr.forEach((idx) => {
      const obj = getImminenceFilterResults(idx);
      const resultsDomMiniNav = new resultsDomMiniNavComponent(obj);
      const resultsDomList = new resultsDomListComponent(obj);

      const imminenceResult = initDiv(this.getCssClass("imminenceResults"));
      imminenceResult.append(resultsDomMiniNav.div, resultsDomList.div);

      imminenceResults.push(imminenceResult);
    });

    return imminenceResults;
  }
}
