import { initDiv } from "../js-utilities/commonDomComponents.js";
import projectDomComponent from "./projectDomComponent.js";

//  Differently from projectDomMiniComponent, this is not editable via UI and shows only the title

export default class projectDomMiniNavComponent extends projectDomComponent {
  static blockName = "project-mini-nav-div";

  constructor(obj) {
    super(obj);
  }

  // redefine the init() method
  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.append(this.initTitle());

    this.div.associatedProject = this.obj;
    this.div.addEventListener(
      "click",
      this.constructor.btnRenderProjectCallback
    );
  }

  // callbacks
  static btnRenderProjectCallback = (e) => {
    document.body.mainDomObj.renderProject(e.currentTarget.associatedProject);
    e.stopPropagation();
  };
}
