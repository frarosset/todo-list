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

  // callbacks
  static btnRenderItemCallback = (e) => {
    document.body.mainDomObj.renderTodo(e.currentTarget.associatedItem);
    e.stopPropagation();
  };
}
