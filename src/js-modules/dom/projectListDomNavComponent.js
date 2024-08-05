import baseListDomComponent from "./baseListDomComponent.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";

export default class projectListDomNavComponent extends baseListDomComponent {
  static blockName = "project-list-div";
  static associatedDialog = () => document.body.projectFormDialog; // method to fetch the dialog after its creation
  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new projectDomMiniNavComponent(item);
  }
}
