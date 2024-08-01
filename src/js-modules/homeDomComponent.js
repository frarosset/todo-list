import { initDiv, initH2, initP } from "../js-utilities/commonDomComponents.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";
import projectListDomComponent from "./projectListDomComponent.js";

import noteComponent from "./noteComponent.js";
import noteDomComponent from "./noteDomComponent.js";
import noteDomMiniComponent from "./noteDomMiniComponent.js";
import noteListDomComponent from "./noteListDomComponent.js";
import noteListComponent from "./noteListComponent.js";

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

    const projectListDom = new projectListDomComponent(root.customProjectsList);

    contentDiv.append(inboxDom.div, projectListDom.div);

    // Sample test for notes
    const testNote = new noteComponent({
      title: "My first note",
      description: "Just a test",
      tags: new Set(["to", "be", "removed"]),
    }); // no parent, no list
    console.log(testNote.print());
    const testNoteDom = new noteDomComponent(testNote);
    contentDiv.append(testNoteDom.div);
    const testNoteMiniDom = new noteDomMiniComponent(testNote);
    contentDiv.append(testNoteMiniDom.div);
    const testNoteList = new noteListComponent("Notes", null); // note: initialized at each home page rendering
    const testNoteListiDom = new noteListDomComponent(testNoteList);
    contentDiv.append(testNoteListiDom.div);

    return contentDiv;
  }
}
