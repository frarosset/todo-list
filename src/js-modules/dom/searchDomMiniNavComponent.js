import searchDomComponent from "./searchDomComponent.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

//  Differently from searchDomComponent, this is not editable via UI and shows only the title

export default class searchDomMiniNavComponent extends searchDomComponent {
  static blockName = "search-mini-nav-div";

  constructor(obj, showPath = false) {
    super(obj, showPath);
  }
}

domMiniComponentMixin(searchDomMiniNavComponent, true); // for nav
