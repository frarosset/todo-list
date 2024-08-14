import { initP } from "../../js-utilities/commonDomComponents.js";
import baseListDomComponent from "./baseListDomComponent.js";
import { todoDomMiniComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "./uiIcons.js";
import PubSub from "pubsub-js";

export default class todoListDomComponent extends baseListDomComponent {
  static blockName = "todo-list-div";
  static associatedDialog = () => document.body.todoFormDialog; // method to fetch the dialog after its creation
  static icon = uiIcons.todoList;

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  // Methods

  initItemDom(item) {
    return new todoDomMiniComponent(item, this.showPath);
  }

  initSize() {
    const sizeStr = () =>
      `${this.obj.size - this.obj.nTodo} / ${this.obj.size}`;

    const p = initP(this.getCssClass("size"), null, sizeStr());

    for (const event of ["SIZE CHANGE", "NTODO CHANGE"]) {
      PubSub.subscribe(this.getPubSubName(event, "main"), (msg) => {
        console.log(msg);
        p.textContent = sizeStr();
      });
    }

    return p;
  }
}
