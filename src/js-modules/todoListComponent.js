import todoComponent from "./todoComponent.js";
import baseListComponent from "./baseListComponent.js";

export default class todoListComponent extends baseListComponent {
  constructor(name, parent) {
    super(name, parent);
  }

  // Methods

  initItem(data) {
    return new todoComponent(data, this.parent);
  }
}
