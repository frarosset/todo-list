import baseListDomComponent from "./baseListDomComponent.js";
import { todoDomMiniComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "./uiIcons.js";

export default class todoListDomComponent extends baseListDomComponent {
  static blockName = "todo-list-div";
  static associatedDialog = () => document.body.todoFormDialog; // method to fetch the dialog after its creation
  static icon = uiIcons.todoList;

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new todoDomMiniComponent(item);
  }
}
