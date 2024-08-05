import { initDiv, initButton } from "../../js-utilities/commonDomComponents.js";
import { projectDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "./uiIcons.js";
import PubSub from "pubsub-js";

export default class projectDomMiniComponent extends projectDomComponent {
  static blockName = "project-mini-div";
  static cssClass = {
    ...projectDomComponent.cssClass,
    expandBtn: `expand-btn`,
  };

  constructor(obj) {
    super(obj);
  }

  // redefine the init() method
  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.append(this.initExpandBtn());
    this.div.append(this.initPath());
    this.div.append(this.initTitle());
    this.div.appendChild(this.initActionButtons());

    this.div.associatedProject = this.obj;
    this.div.addEventListener(
      "click",
      this.constructor.btnRenderProjectCallback
    );
  }

  // Components initialization
  initExpandBtn() {
    const expandBtn = initButton(
      this.getCssClass("expandBtn"),
      this.constructor.btnRenderProjectCallback,
      uiIcons.expand
    );
    expandBtn.associatedProject = this.obj;
    return expandBtn;
  }

  // callbacks
  static btnRenderProjectCallback = (e) => {
    PubSub.publish("RENDER PROJECT", e.currentTarget.associatedProject);
    e.stopPropagation();
  };

  updateView() {
    PubSub.publish(
      this.obj.list.getPubSubName("REMOVE ITEM", "main"),
      this.div
    );
  }
}