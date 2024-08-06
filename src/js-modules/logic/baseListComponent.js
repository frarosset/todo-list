import baseComponent from "./baseComponent.js";
import PubSub from "pubsub-js";

export default class baseListComponent {
  #list;

  getPubSubName(str, topic = null) {
    const topicStr = topic ? `${topic}:` : "";
    const parentStr =
      this.parent != null ? `${this.parent.type}${this.parent.id}` : "null";
    return `${topicStr} ${parentStr}>${this.name} ${str}`;
  }

  constructor(name, parent, itemData = []) {
    this.name = name;
    this.parent = parent;

    this.#list = [];

    itemData.forEach((data) => this.addItem(data));
  }

  print() {
    let str = "";
    if (this.#list.length) {
      str += `\n\n\t/List: ${this.name} -----------------------------------`;
      this.#list.forEach((item, idx) => {
        if (idx > 0) {
          str += `\n\n\t|-----------------------------------`;
        }
        str += `\n\n${item.print()}`;
      });
      str += `\n\n\t\\List: ${this.name} (end) -----------------------------`;
    }
    return str;
  }

  // Getter methods

  get list() {
    return this.#list;
  }

  // Methods

  initItem(data) {
    return new baseComponent(data, this.parent, this);
  }

  updateParentDateOfEdit() {
    if (this.parent) {
      this.parent.updateDateOfEdit();
    }
  }

  addItem(data) {
    const item = this.initItem(data);
    this.#list.push(item);
    this.updateParentDateOfEdit();

    // publish the 'ADD ITEM' only once
    PubSub.publish(this.getPubSubName("ADD ITEM", "main"), item);

    return item;
  }

  // todo: check. this will be used to initialize the array
  addMultipleItems(dataArray) {
    // create any todo/item initialize: TODO
    dataArray.forEach((data) => {
      this.addItem(data);
    });
  }

  removeItem(item) {
    /* item is a reference to a item object */
    const idx = this.#list.indexOf(item);
    if (idx >= 0) {
      this.#list.splice(idx, 1);
      this.updateParentDateOfEdit();
    }
  }

  // Serialization method
  toJSON() {
    const list = [];
    this.#list.forEach((item) => list.push(item.toJSON()));
    return list;
  }
}
