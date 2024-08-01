import baseComponent from "./baseComponent.js";

export default class noteComponent extends baseComponent {
  static nextId = 0;

  constructor(data, parent = null, list = null) {
    super(data, parent, list);
    // overwrite type
    this.type = "N";
  }
}
