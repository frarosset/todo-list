import baseListDomComponent from "./baseListDomComponent.js";
import todoDomMiniComponent from "./todoDomMiniComponent.js";

export default class todoListDomComponent extends baseListDomComponent {
  static blockName = "todo-list-div";
  static associatedDialog = () => document.body.todoFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new todoDomMiniComponent(item);
  }
}
