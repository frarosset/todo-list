import baseComponent from "./baseComponent.js";
import PubSub from "pubsub-js";

export default class baseListComponent {
  #list;

  getPubSubName(str, topic = null, includeParent = true) {
    const topicStr = topic ? `${topic}:` : "";
    const parentStr =
      this.parent != null ? `${this.parent.type}${this.parent.id}` : "null";
    const PathStr = includeParent ? `${parentStr}>` : "";
    return `${topicStr}${PathStr}L${this.type} ${str}`;
  }

  constructor(name, parent, itemData = [], editable = true) {
    this.name = name;
    this.parent = parent;
    this.type = "B";
    this.editable = editable;

    this.#list = [];

    this.nTodoNested = 0;
    this.nTodo = 0;

    itemData.forEach((data) => this.addItem(data));
  }

  increaseNTodoNested(amount = 1) {
    this.nTodoNested += amount;
    console.log(this.infoOnPropertyStr("nTodoNested"));
    PubSub.publish(this.getPubSubName("NTODONESTED CHANGE", "main"));
  }
  decreaseNTodoNested(amount = 1) {
    this.nTodoNested -= amount;
    console.log(this.infoOnPropertyStr("nTodoNested"));
    PubSub.publish(this.getPubSubName("NTODONESTED CHANGE", "main"));
  }

  infoOnPropertyStr(property) {
    return `>>> ${property}: ${this[property]} [${this.pathAndThisStr}] (L${this.type})`;
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

  get size() {
    return this.#list.length;
  }

  idxOf(item) {
    return this.#list.indexOf(item);
  }
  has(item) {
    return this.#list.includes(item);
  }

  get path() {
    const path = [];
    let obj = this.parent;
    while (obj != null) {
      path.unshift(obj);
      obj = obj.parent;
    }
    return path;
  }

  get pathAndThis() {
    return [this.path, this];
  }

  get pathStr() {
    return this.path.reduce((str, obj) => {
      str += `${obj.title} / `;
      return str;
    }, "");
  }

  get pathAndThisStr() {
    return this.pathStr + this.name;
  }

  // Methods

  initItem(data) {
    return new baseComponent(data, this.parent, this);
  }

  updateParentDateOfEdit() {
    if (this.parent) {
      // update the date of edit of the parent only if it is not of type 'R'(results)
      if (this.parent.type !== "R") {
        this.parent.updateDateOfEdit();
      }
    } else {
      // publish the general 'EDITED' token only once, when you reach the root
      PubSub.publish("EDITED");
    }
  }

  addItem(data) {
    const item = this.initItem(data);
    this.insertItem(item);
    return item;
  }

  // todo: check. this will be used to initialize the array
  addMultipleItems(dataArray) {
    // create any todo/item initialize: TODO
    dataArray.forEach((data) => {
      this.addItem(data);
    });
  }

  insertItem(item) {
    this.#list.push(item);
    this.updateParentDateOfEdit();

    // publish the 'ADD ITEM' only once
    PubSub.publish(this.getPubSubName("ADD ITEM", "main"), item);
    PubSub.publish(this.getPubSubName("SIZE CHANGE", "main"));
  }

  removeItem(item, primary = true) {
    /* item is a reference to a item object */
    const idx = this.#list.indexOf(item);
    if (idx >= 0) {
      this.#list.splice(idx, 1);
      PubSub.publish(this.getPubSubName("REMOVE ITEM", "main"), item);

      if (primary) {
        // Primary: the list is in the root tree
        // Decrease the number of todo in this list and the ancestors
        this.decreaseNTodoNested(item.nTodoNested);
        item.decreaseParentNTodoNested(item.nTodoNested);

        this.updateParentDateOfEdit();

        const publishTokenToRemove = (item) => {
          // First notify the removal also the descendants, if any, by recursion
          Object.values(item.data.lists).forEach((listComponent) => {
            listComponent.list.forEach((subItem) => {
              publishTokenToRemove(subItem);
            });
          });
          //Handle the removal of a item via PubSub: any list of the same type subscribed to this token checks whether obj is being represented there and removes it.
          PubSub.publish(
            item.list.getPubSubName("REMOVE ITEM", "main", false),
            item
          );
        };

        publishTokenToRemove(item);
      }

      PubSub.publish(this.getPubSubName("SIZE CHANGE", "main"));
    }
  }

  // Serialization method
  toJSON() {
    const list = [];
    this.#list.forEach((item) => list.push(item.toJSON()));
    return list;
  }

  // Filters and sizes
  // variable is: state, imminence, tags, ... (any key in baseCompoennt.filterCallbacks)

  filterBy(variable, value) {
    return this.list.filter((itm) => itm.match(variable, value));
  }

  filterByNested(variable, value) {
    const matchArray = this.list.reduce((arr, itm) => {
      arr.push(...itm.filterByNested(variable, value));
      return arr;
    }, []);

    // console.log(
    //   `FilterByNested (${variable},${value}) from list '${this.name}':`,
    //   matchArray
    // ); // debug

    return matchArray;
  }

  search(lookupStr, variableArr = ["title", "description", "tags"]) {
    const matchSet = new Set();

    variableArr.forEach((variable) => {
      const lookupArr = this.filterByNested(variable, lookupStr);
      if (lookupArr.length) {
        lookupArr.forEach((itm) => matchSet.add(itm));
      }
    });
    return [...matchSet];
  }

  sizeBy(variable, value) {
    return this.filterBy(variable, value).length;
  }

  sizeByNested(variable, value) {
    return this.filterByNested(variable, value).length;
  }

  getAllTagsNested() {
    const tagsArr = this.list.reduce((arr, itm) => {
      arr.push(...itm.getAllTagsNested());
      return arr;
    }, []);

    return new Set(tagsArr);
  }

  getAllOfTypeNested(type) {
    const matchArray = this.type === type ? [...this.list] : [];

    matchArray.push(
      ...this.list.reduce((arr, itm) => {
        arr.push(...itm.getAllOfTypeNested_withoutThis(type));
        return arr;
      }, [])
    );

    return matchArray;
  }
}
