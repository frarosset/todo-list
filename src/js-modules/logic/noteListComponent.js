import { noteComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";

export default class noteListComponent extends baseListComponent {
  constructor(name, parent, itemData = [], editable = true) {
    super(name, parent, itemData, editable);
    this.type = "N";
  }

  // Methods

  initItem(data) {
    return new noteComponent(data, this.parent, this);
  }
}
