import { todoComponent } from "./fixCircularDependenciesInComponents.js";
import baseListComponent from "./baseListComponent.js";
import PubSub from "pubsub-js";

export default class todoListComponent extends baseListComponent {
  constructor(name, parent, itemData = [], editable = true) {
    super(name, parent, itemData, editable);
    this.type = "T";
  }

  // Methods

  initItem(data) {
    return new todoComponent(data, this.parent, this);
  }

  insertItem(item) {
    super.insertItem(item);
    if (item.stateIdx !== todoComponent.doneIdx) {
      this.increaseNTodo();
    }
  }

  removeItem(item, notify = true) {
    if (item.stateIdx !== todoComponent.doneIdx) {
      item.decreaseParentNTodoNested();
      this.decreaseNTodo();
    }
    super.removeItem(item, notify);
  }

  increaseNTodo(amount = 1) {
    this.nTodo += amount;
    console.log(this.infoOnPropertyStr("nTodo"));
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
  decreaseNTodo(amount = 1) {
    this.nTodo -= amount;
    console.log(this.infoOnPropertyStr("nTodo"));
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
}
