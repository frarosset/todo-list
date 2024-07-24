import baseListDomComponent from "./baseListDomComponent.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";

export default class projectListDomNavComponent extends baseListDomComponent {
  static blockName = "project-list-div";

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new projectDomMiniNavComponent(item);
  }
}
