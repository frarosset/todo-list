import { isBefore, isAfter } from "date-fns";
import baseComponent from "./baseComponent.js";
import PubSub from "pubsub-js";

export default class baseListComponent {
  #list;

  static defultSettings = {
    sortBy: "dateOfCreation",
    descending: false,
  };

  static icon = null;

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

    this.settings = Object.assign({}, this.constructor.defultSettings);

    itemData.forEach((data) => this.addItem(data));
  }

  increaseNTodoNested(amount = 1) {
    this.nTodoNested += amount;
    //console.log(this.infoOnPropertyStr("nTodoNested"));
    PubSub.publish(this.getPubSubName("NTODONESTED CHANGE", "main"));
  }
  decreaseNTodoNested(amount = 1) {
    this.nTodoNested -= amount;
    //console.log(this.infoOnPropertyStr("nTodoNested"));
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

  get sizeInfo() {
    return {
      str: `${this.size}`,
      tokens: [this.getPubSubName("SIZE CHANGE", "main")],
    };
  }

  get icon() {
    if (this.cusomIcon) {
      return this.cusomIcon;
    } else {
      return this.constructor.icon;
    }
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

  insertItem(item, primary = true) {
    this.#list.push(item);

    PubSub.publish(this.getPubSubName("ADD ITEM", "main"), item);
    PubSub.publish(this.getPubSubName("SIZE CHANGE", "main"));

    if (primary) {
      this.updateParentDateOfEdit();
      PubSub.publish(this.getPubSubName("ADD ITEM", "main", false), item);
    }
  }

  removeItem(item, primary = true) {
    /* item is a reference to a item object */
    const idx = this.#list.indexOf(item);
    if (idx >= 0) {
      this.#list.splice(idx, 1);
      PubSub.publish(this.getPubSubName("REMOVE ITEM", "main"), item);
      PubSub.publish(this.getPubSubName("SIZE CHANGE", "main"));

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
    }
  }

  reset(primary = true) {
    const itemsToRemove = [...this.#list];
    itemsToRemove.forEach((item) => this.removeItem(item, primary));
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

  search(lookupStr, variableArr = ["title", "description", "tag"]) {
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

  static strSortCallback = (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
  };
  static dateSortCallback = (a, b) => {
    if (a == null) {
      return b == null ? 0 : -1;
    }
    if (b == null) return 1;
    return isBefore(a, b) ? -1 : isAfter(a, b) ? 1 : 0;
  };
  static numSortCallback = (a, b) => a - b;

  static sortCallbacks = {
    title: (a, b) => baseListComponent.strSortCallback(a.title, b.title),
    dateOfCreation: (a, b) =>
      baseListComponent.dateSortCallback(a.dateOfCreation, b.dateOfCreation),
    dateOfEdit: (a, b) =>
      baseListComponent.dateSortCallback(a.dateOfEdit, b.dateOfEdit),
    path: (a, b) => {
      const result = baseListComponent.strSortCallback(a.pathStr, b.pathStr);
      if (result == 0)
        return baseListComponent.strSortCallback(
          a.pathAndThisStr,
          b.pathAndThisStr
        );
      else return result;
    },
    nTodoNested: (a, b) =>
      baseListComponent.numSortCallback(a.nTodoNested, b.nTodoNested),
  };

  getSortedBy(variable, descending = false) {
    const callback = this.constructor.sortCallbacks[variable];
    if (!callback || this.length == 0) return [];

    const sortedList = this.list.toSorted(callback);
    if (descending) {
      sortedList.reverse();
    }
    return sortedList;
  }

  getSorted() {
    return this.getSortedBy(this.settings.sortBy, this.settings.descending);
  }
}
