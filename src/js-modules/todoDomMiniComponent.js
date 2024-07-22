import { initDiv } from "../js-utilities/commonDomComponents.js";
import todoDomComponent from "./todoDomComponent.js";

export default class todoDomMiniComponent extends todoDomComponent {
  static blockName = "todo-mini-div";

  constructor(obj) {
    super(obj);
  }

  // redefine the init() method
  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.appendChild(this.initStatusBtn());
    this.div.appendChild(this.initImminenceIcon());
    this.div.appendChild(this.initPath());
    this.div.appendChild(this.initTitle());

    this.div.append(this.initOtherInfo());
  }

  // Block initialization
  initOtherInfo() {
    const div = initDiv(this.getCssClass("otherInfosDiv"));

    div.append(this.initDueDate(""));

    return div;
  }

  // Components initialization
}
