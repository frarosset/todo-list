import projectComponent from "./projectComponent.js";
import baseListComponent from "./baseListComponent.js";

export default class projectListComponent extends baseListComponent {
  constructor(name, parent) {
    super(name, parent);
  }

  // Methods

  initItem(data) {
    return new projectComponent(data, this.parent, this);
  }
}
