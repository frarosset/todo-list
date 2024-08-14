import { projectDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

//  Differently from projectDomMiniComponent, this is not editable via UI and shows only the title

export default class projectDomMiniNavComponent extends projectDomComponent {
  static blockName = "project-mini-nav-div";

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }
}

domMiniComponentMixin(projectDomMiniNavComponent, true); // for nav
