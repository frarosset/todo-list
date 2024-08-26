import filtersAndTagsDomComponent from "./filtersAndTagsDomComponent.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

//  Differently from filtersAndTagsDomComponent, this is not editable via UI and shows only the title

export default class filtersAndTagsDomMiniNavComponent extends filtersAndTagsDomComponent {
  static blockName = "filters-and-tags-mini-nav-div";

  constructor(obj, showPath = false) {
    super(obj, showPath);
  }
}

domMiniComponentMixin(filtersAndTagsDomMiniNavComponent, true); // for nav
