import baseListDomComponent from "./baseListDomComponent.js";
import projectDomMiniNavComponent from "./projectDomMiniNavComponent.js";
import { uiIcons } from "./uiIcons.js";

export default class projectListDomNavComponent extends baseListDomComponent {
  static blockName = "project-list-div";
  static associatedDialog = () => document.body.projectFormDialog; // method to fetch the dialog after its creation
  static icon = uiIcons.projectList;

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  // Methods

  initItemDom(item) {
    return new projectDomMiniNavComponent(item, this.showPath);
  }
}
