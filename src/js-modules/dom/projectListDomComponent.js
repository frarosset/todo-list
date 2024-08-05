import baseListDomComponent from "./baseListDomComponent.js";
import { projectDomMiniComponent } from "./fixCircularDependenciesInDomComponents.js";

export default class projectListDomComponent extends baseListDomComponent {
  static blockName = "project-list-div";
  static associatedDialog = () => document.body.projectFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new projectDomMiniComponent(item);
  }
}
