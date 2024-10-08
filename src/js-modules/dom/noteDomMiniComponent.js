import { noteDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { domMiniComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class noteDomMiniComponent extends noteDomComponent {
  static blockName = "note-mini-div";

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }
}

domMiniComponentMixin(noteDomMiniComponent);
