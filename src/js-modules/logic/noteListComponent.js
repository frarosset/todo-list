import { noteComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";

export default class noteListComponent extends baseListComponent {
  constructor(name, parent, itemData = []) {
    super(name, parent, itemData);
    this.type = "N";
  }

  // Methods

  initItem(data) {
    return new noteComponent(data, this.parent, this);
  }
}
