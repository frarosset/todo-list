import baseListDomComponent from "./baseListDomComponent.js";
import projectDomMiniComponent from "./projectDomMiniComponent.js";

export default class projectListDomComponent extends baseListDomComponent {
  static blockName = "project-list-div";

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new projectDomMiniComponent(item);
  }
}
