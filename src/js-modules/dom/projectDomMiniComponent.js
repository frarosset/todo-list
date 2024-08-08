import { projectDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class projectDomMiniComponent extends projectDomComponent {
  static blockName = "project-mini-div";

  constructor(obj) {
    super(obj);
  }
}

domMiniComponentMixin(projectDomMiniComponent);
