import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class todoDomMiniComponent extends todoDomComponent {
  static blockName = "todo-mini-div";

  constructor(obj) {
    super(obj);

    this.div.appendChild(this.initStatusBtn());
    this.div.appendChild(this.initImminenceIcon());
  }

  // Block initialization
  initOtherInfo() {
    const div = super.initOtherInfo(true, false);
    div.append(this.initDueDate(""));

    return div;
  }
}

domMiniComponentMixin(todoDomMiniComponent);
