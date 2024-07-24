import baseComponent from "./baseComponent.js";

export default class baseListComponent {
  #list;

  constructor(name, parent) {
    this.name = name;
    this.parent = parent;

    this.#list = [];
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
    return new baseComponent(data, this.parent);
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
    /* todo is a reference to a todo object */
    const idx = this.#list.indexOf(item);
    if (idx >= 0) {
      this.#list.splice(idx, 1);
      this.updateParentDateOfEdit();
    }
  }
}
