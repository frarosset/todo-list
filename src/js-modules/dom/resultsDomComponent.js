import genericBaseDomComponent from "./genericBaseDomComponent.js";
import { listInDomComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class resultsDomComponent extends genericBaseDomComponent {
  static blockName = "results-div";

  static cssClass = {
    ...genericBaseDomComponent.cssClass,
  };

  constructor(obj, showPath = true) {
    super(obj, showPath);
    this.initAllDomLists(); // method added via composition (see below), hide path
  }
}

// Add todoDomList, projectDomList, noteDomList (based on what is defined in this.obj.list)
// with composition (using mixin) with this method:
// - initAllDomLists -------------> must be called in the constructor
listInDomComponentMixin(resultsDomComponent);
