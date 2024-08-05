import { initDiv, initButton } from "../../js-utilities/commonDomComponents.js";
import { noteDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "./uiIcons.js";
import PubSub from "pubsub-js";

export default class noteDomMiniComponent extends noteDomComponent {
  static blockName = "note-mini-div";
  static cssClass = {
    ...noteDomComponent.cssClass,
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

    this.div.associatedNote = this.obj;
    this.div.addEventListener("click", this.constructor.btnRenderNoteCallback);
  }

  // Components initialization
  initExpandBtn() {
    const expandBtn = initButton(
      this.getCssClass("expandBtn"),
      this.constructor.btnRenderNoteCallback,
      uiIcons.expand
    );
    expandBtn.associatedNote = this.obj;
    return expandBtn;
  }

  // callbacks
  static btnRenderNoteCallback = (e) => {
    PubSub.publish("RENDER NOTE", e.currentTarget.associatedNote);
    e.stopPropagation();
  };

  updateView() {
    PubSub.publish(
      this.obj.list.getPubSubName("REMOVE ITEM", "main"),
      this.div
    );
  }
}
