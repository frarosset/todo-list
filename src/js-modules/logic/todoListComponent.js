import { todoComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";

export default class todoListComponent extends baseListComponent {
  constructor(name, parent, itemData = []) {
    super(name, parent, itemData);
  }

  // Methods

  initItem(data) {
    return new todoComponent(data, this.parent, this);
  }
}
