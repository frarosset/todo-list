import { initDiv } from "../../js-utilities/commonDomComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class todoDomMiniComponent extends todoDomComponent {
  static blockName = "todo-mini-div";

  constructor(obj) {
    super(obj);

    this.div.appendChild(this.initStatusBtn());
    this.div.appendChild(this.initImminenceIcon());
    this.div.append(this.initOtherInfo());
  }

  // Block initialization
  initOtherInfo() {
    const div = initDiv(this.getCssClass("otherInfosDiv"));
    div.append(this.initDueDate(""));

    return div;
  }
}

domMiniComponentMixin(todoDomMiniComponent);
