import { todoComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";
import PubSub from "pubsub-js";
import { uiIcons } from "../uiIcons.js";

export default class todoListComponent extends baseListComponent {
  static icon = uiIcons.todoList;

  constructor(name, parent, itemData = [], editable = true) {
    super(name, parent, itemData, editable);
    this.type = "T";
  }

  // Methods

  get sizeInfo() {
    return {
      str: `${this.size - this.nTodo} / ${this.size}`,
      tokens: [
        this.getPubSubName("SIZE CHANGE", "main"),
        this.getPubSubName("NTODO CHANGE", "main"),
      ],
    };
  }

  initItem(data) {
    return new todoComponent(data, this.parent, this);
  }

  insertItem(item, primary = true) {
    if (item.stateIdx !== todoComponent.doneIdx) {
      this.increaseNTodo();
    }
    super.insertItem(item, primary);
  }

  removeItem(item, primary = true) {
    if (!this.has(item)) return;

    if (item.stateIdx !== todoComponent.doneIdx) {
      if (primary) {
        item.decreaseParentNTodoNested();
      }
      this.decreaseNTodo();
    }
    super.removeItem(item, primary);
  }

  increaseNTodo(amount = 1) {
    this.nTodo += amount;
    //console.log(this.infoOnPropertyStr("nTodo"));
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
  decreaseNTodo(amount = 1) {
    this.nTodo -= amount;
    //console.log(this.infoOnPropertyStr("nTodo"));
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }

  static sortCallbacks = {
    ...baseListComponent.sortCallbacks,
    priority: (a, b) =>
      baseListComponent.numSortCallback(a.priorityIdx, b.priorityIdx),
    state: (a, b) => baseListComponent.numSortCallback(a.stateIdx, b.stateIdx),
    dueDate: (a, b) => baseListComponent.dateSortCallback(a.dueDate, b.dueDate),
  };
}
