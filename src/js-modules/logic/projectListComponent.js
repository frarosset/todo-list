import { projectComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";
import { uiIcons } from "../uiIcons.js";

export default class projectListComponent extends baseListComponent {
  static icon = uiIcons.projectList;

  constructor(name, parent, itemData = [], editable = true) {
    super(name, parent, itemData, editable);
    this.type = "P";
  }

  // Methods

  initItem(data) {
    return new projectComponent(data, this.parent, this);
  }
}
