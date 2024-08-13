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

  addItem(data) {
    const item = super.addItem(data);
    if (item.stateIdx !== todoComponent.doneIdx) {
      this.increaseNTodo();
    }
    return item;
  }

  removeItem(item) {
    if (item.stateIdx !== todoComponent.doneIdx) {
      item.decreaseParentNTodoNested();
      this.decreaseNTodo();
    }
    super.removeItem(item);
  }

  increaseNTodo(amount = 1) {
    this.nTodo += amount;
    console.log(this.name, this.nTodo, "(one level)");
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
  decreaseNTodo(amount = 1) {
    this.nTodo -= amount;
    console.log(this.name, this.nTodo, "(one level)");
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
}
