import {
  initDiv,
  initH2,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";
import { projectListDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import filtersAndTagsComponent from "../logic/filtersAndTagsComponent.js";
import filtersAndTagsDomMiniNavComponent from "./filtersAndTagsDomMiniNavComponent.js";
import searchComponent from "../logic/searchComponent.js";
import searchDomMiniNavComponent from "./searchDomMiniNavComponent.js";
import todoComponent from "../logic/todoComponent.js";
import todoDomComponent from "./todoDomComponent.js";
import resultsComponent from "../logic/resultsComponent.js";
import resultsDomListComponent from "./resultsDomListComponent.js";
import resultsDomMiniNavComponent from "./resultsDomMiniNavComponent.js";

import { uiIcons } from "../uiIcons.js";

export default class homeDomComponent {
  static blockName = "home-div";

  static cssClass = {
    header: `header`,
    content: `content`,
    path: `path`,
    titleH2: `title-h2`,
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
    const h2 = initH2(this.getCssClass("titleH2"), null, "Home");

    header.appendChild(path);
    header.appendChild(h2);
    return header;
  }

  initContent(root) {
    const contentDiv = initDiv(this.getCssClass("content"));

    const inboxDom = new projectDomMiniNavComponent(root.inboxProject);

    /**/

    const imminenceResultsComponents = [];
    const imminenceResults = [];
    const getImminenceFilterResults = (idx) => {
      return new resultsComponent(
        {
          title: todoComponent.imminenceLabels[idx],
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
      imminenceResultsComponents.push(getImminenceFilterResults(idx));
    });
    imminenceResultsComponents.forEach((obj) => {
      const resultsDomMiniNav = new resultsDomMiniNavComponent(obj);
      const resultsDomList = new resultsDomListComponent(obj);

      const imminenceResult = initDiv(this.getCssClass("imminenceResults"));
      imminenceResult.append(resultsDomMiniNav.div, resultsDomList.div);

      imminenceResults.push(imminenceResult);
    });

    /**/

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

    contentDiv.append(
      inboxDom.div,
      ...imminenceResults, // it's an array of divs
      filtersAndTagsDomMiniNav.div,
      searchDomMiniNav.div,
      projectListDom.div
    );

    return contentDiv;
  }
}
