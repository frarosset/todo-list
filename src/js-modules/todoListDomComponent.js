import baseListDomComponent from "./baseListDomComponent.js";
import todoDomMiniComponent from "./todoDomMiniComponent.js";

export default class todoListDomComponent extends baseListDomComponent {
  static blockName = "todo-list-div";

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new todoDomMiniComponent(item);
  }
}
