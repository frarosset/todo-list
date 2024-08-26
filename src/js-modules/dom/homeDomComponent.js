import {
  initDiv,
  initH2,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";
import { projectListDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import resultsComponent from "../logic/resultsComponent.js";
import resultsDomComponent from "./resultsDomComponent.js";
import filtersAndTagsComponent from "../logic/filtersAndTagsComponent.js";
import filtersAndTagsDomMiniNavComponent from "./filtersAndTagsDomMiniNavComponent.js";
import resultsDomMiniNavComponent from "./resultsDomMiniNavComponent.js";

import { uiIcons } from "./uiIcons.js";

export default class homeDomComponent {
  static blockName = "home-div";

  static cssClass = {
    header: `header`,
    content: `content`,
    path: `path`,
    titleH2: `title-h2`,
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

    const projectListDom = new projectListDomComponent(
      root.customProjectsList,
      false //hide path
    );

    const resComp2 = new resultsComponent(
      {
        title: "Search: test",
        icon: null,
        variable: "",
        value: "test",
      },
      root
    );
    const resDomComp2 = new resultsDomComponent(resComp2);
    const resDomComp3 = new resultsDomMiniNavComponent(resComp2);

    const filtersAndTags = new filtersAndTagsComponent({}, root);
    const filtersAndTagsDomMiniNav = new filtersAndTagsDomMiniNavComponent(
      filtersAndTags
    );

    contentDiv.append(
      inboxDom.div,
      filtersAndTagsDomMiniNav.div,
      projectListDom.div,
      resDomComp3.div,
      resDomComp2.div
    );

    return contentDiv;
  }
}
