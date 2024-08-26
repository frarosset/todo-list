import resultsDomComponent from "./resultsDomComponent.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

//  Differently from filtersAndTagsDomComponent, this is not editable via UI and shows only the title

export default class resultsDomMiniNavComponent extends resultsDomComponent {
  static blockName = "results-mini-nav-div";

  constructor(obj, showPath = false) {
    super(obj, showPath);
  }
}

domMiniComponentMixin(resultsDomMiniNavComponent, true); // for nav
