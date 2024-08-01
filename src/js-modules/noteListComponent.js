import noteComponent from "./noteComponent.js";
import baseListComponent from "./baseListComponent.js";

export default class noteListComponent extends baseListComponent {
  constructor(name, parent) {
    super(name, parent);
  }

  // Methods

  initItem(data) {
    return new noteComponent(data, this.parent, this);
  }
}
