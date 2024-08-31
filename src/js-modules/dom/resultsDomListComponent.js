import { initDiv } from "../../js-utilities/commonDomComponents.js";
import resultsDomComponent from "./resultsDomComponent.js";
import { listInDomComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

//  Differently from projectDomComponent, this is not editable via UI and shows only the title

export default class resultsDomListComponent extends resultsDomComponent {
  static blockName = "results-div";

  constructor(obj, showPath = false) {
    super(obj, showPath);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.content = this.initContent();
    this.div.appendChild(this.content);

    this.initAllDomLists(); // method added via composition (see below), hide path
  }
}

// Add todoDomList, projectDomList, noteDomList (based on what is defined in this.obj.list)
// with composition (using mixin) with this method:
// - initAllDomLists -------------> must be called in the constructor
listInDomComponentMixin(resultsDomListComponent);
