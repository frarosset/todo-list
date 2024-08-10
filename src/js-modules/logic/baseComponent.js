import { format } from "date-fns";
import PubSub from "pubsub-js";
import { subStrMatch } from "../../js-utilities/commonUtilities.js";

export default class baseComponent {
  data;

  static icon = null;

  static defaultData = {
    id: null,
    title: "",
    description: "",
    tags: new Set() /* to avoid duplicated tags*/,
    dateOfCreation: null,
    dateOfEdit: null,
    icon: null,
  };
  static nextId = 0;
  static dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

  getPubSubName(str, topic = null) {
    const topicStr = topic ? `${topic}:` : "";
    return `${topicStr}${this.type}${this.id} ${str}`;
  }

  extractData(data) {
    const dataProperties = Object.keys(this.constructor.defaultData);
    const extractedData = dataProperties
      .filter((key) => key in data)
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    return extractedData;
  }

  constructor(data, parent = null, list = null, editable = true) {
    this.data = Object.assign(
      {},
      this.constructor.defaultData,
      this.extractData(data)
    );

    if (this.data.id == null) {
      this.data.id = this.constructor.nextId;
      this.constructor.nextId++;
    }

    if (!this.data.dateOfCreation) {
      this.data.dateOfCreation = new Date();
    }

    // if (!this.data.dateOfEdit) {
    //   this.data.dateOfEdit = this.data.dateOfCreation;
    // }

    this.parent = parent;
    this.list = list;
    this.type = "B";

    this.editable = editable; // note: this is only used in the dom

    this.nTodoNested = 0;
  }

  update(data) {
    this.title = data.title;
    this.description = data.description;
    this.tags = data.tags;
  }

  get icon() {
    if (this.data.icon) {
      return this.data.icon;
    } else {
      return this.constructor.icon;
    }
  }

  increaseNTodoNested(amount = 1) {
    this.nTodoNested += amount;
    this.increaseParentNTodoNested(amount);
    this.increaseListNTodoNested(amount);
    console.log(this.pathAndThisStr, this.nTodoNested);
  }
  decreaseNTodoNested(amount = 1) {
    this.nTodoNested -= amount;
    this.decreaseParentNTodoNested(amount);
    this.decreaseListNTodoNested(amount);
    console.log(this.pathAndThisStr, this.nTodoNested);
  }
  increaseParentNTodoNested(amount = 1) {
    if (this.parent != null) {
      this.parent.increaseNTodoNested(amount);
    }
  }
  decreaseParentNTodoNested(amount = 1) {
    if (this.parent != null) {
      this.parent.decreaseNTodoNested(amount);
    }
  }
  increaseListNTodoNested(amount = 1) {
    if (this.list != null) {
      this.list.increaseNTodoNested(amount);
    }
  }
  decreaseListNTodoNested(amount = 1) {
    if (this.list != null) {
      this.list.decreaseNTodoNested(amount);
    }
  }

  // print functions

  printPath() {
    return (
      this.path.reduce((str, obj) => {
        str += `${obj.type}${obj.id}/`;
        return str;
      }, "") + `${this.type}${this.id}`
    );
  }

  print(dateFormat = baseComponent.dateFormat) {
    let str = `${this.printPath()}) '${this.title}' [created: ${this.dateOfCreationFormatted(dateFormat)}, last edited: ${this.dateOfEditFormatted(dateFormat)}]`;
    str += `\n\t${this.description}`;
    str += `\n\ttags: ${this.tags}`;
    return str;
  }

  // Getter methods

  get id() {
    return this.data.id;
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
    return this.pathStr + this.title;
  }

  get title() {
    return this.data.title;
  }

  get description() {
    return this.data.description;
  }

  get tags() {
    return [...this.data.tags.keys()];
  }

  get dateOfCreation() {
    return this.data.dateOfCreation;
  }

  get dateOfEdit() {
    return this.data.dateOfEdit;
  }

  dateOfCreationFormatted(dateFormat = baseComponent.dateFormat) {
    return format(this.data.dateOfCreation, dateFormat);
  }

  dateOfEditFormatted(dateFormat = baseComponent.dateFormat) {
    if (!this.data.dateOfEdit) {
      return "";
    }
    return format(this.data.dateOfEdit, dateFormat);
  }

  hasBeenEdited() {
    return this.data.dateOfEdit !== null;
  }

  // Setter methods
  // Note: id and dateOfCreation cannot be edited
  // Note: dateOfEdit must be updated when one property in data is modified

  updateDateOfEdit() {
    this.data.dateOfEdit = new Date();
    // if the parent is not null, update its date of edit, too!
    if (this.parent != null) {
      // console.log(this.parent.printPath()); //debug
      this.parent.updateDateOfEdit();
    } else {
      // publish the general 'EDITED' token only once, when you reach the root
      PubSub.publish("EDITED");
    }

    // publish the 'main EDITED' token at each level
    PubSub.publish(this.getPubSubName("EDITED", "main"));
  }

  set title(title) {
    if (this.data.title !== title) {
      this.data.title = title;

      PubSub.publish(this.getPubSubName("TITLE CHANGE", "main"));

      this.updateDateOfEdit();
    }
  }

  set description(description) {
    if (this.data.description !== description) {
      this.data.description = description;

      PubSub.publish(this.getPubSubName("DESCRIPTION CHANGE", "main"));

      this.updateDateOfEdit();
    }
  }

  // Methods related to data.tags property
  // addTag and removeTag return true if the object is modified, false otherwise

  set tags(tags) {
    const equalSet = (s1, s2) =>
      s1.size === s2.size && [...s1].every((itm) => s2.has(itm));

    if (!equalSet(this.data.tags, tags)) {
      this.tags.forEach((tag) => this.removeTag(tag));
      tags.forEach((tag) => this.addTag(tag));
    }
  }

  validateTag(tag) {
    return tag.toLowerCase().trim();
  }

  hasTag(tag) {
    tag = this.validateTag(tag);
    return this.data.tags.has(tag);
  }

  addTag(tag) {
    tag = this.validateTag(tag);
    if (!this.hasTag(tag)) {
      this.data.tags.add(tag);

      PubSub.publish(this.getPubSubName("TAG ADD", "main"), tag);

      this.updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }

  removeTag(tag) {
    tag = this.validateTag(tag);
    if (this.data.tags.delete(tag)) {
      PubSub.publish(this.getPubSubName(`TAG REMOVE ${tag}`, "main"));

      this.updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }

  // Serialization method
  toJSON() {
    return {
      id: this.data.id,
      title: this.data.title,
      description: this.data.description,
      tags: [...this.data.tags],
      dateOfCreation: this.data.dateOfCreation,
      dateOfEdit: this.data.dateOfEdit,
    };
  }

  // Filters and sizes

  static filterCallbacks = {
    title: (itm, value) => subStrMatch(itm.title, value),
    description: (itm, value) => subStrMatch(itm.description, value),
    tags: (itm, value) => itm.hasTag(value),
  };

  // variable is: state, imminence, tags, ... (any key in filterCallbacks)
  match(variable, value) {
    const callback = this.constructor.filterCallbacks[variable];

    if (!callback) return false;

    return callback(this, value);
  }

  filterByNested(variable, value) {
    const matchArray = this.match(variable, value) ? [this] : [];

    // console.log(
    //   `FilterByNested (${variable},${value}) from component '${this.title}':`,
    //   matchArray
    // ); // debug

    return matchArray;
  }

  sizeByNested(variable, value) {
    return this.filterByNested(variable, value).length;
  }

  getAllTagsNested() {
    const tagsArr = this.tags;
    return new Set(tagsArr);
  }

  getAllOfTypeNested(type) {
    const matchArray = this.type === type ? [this] : [];
    matchArray.push(...this.getAllOfTypeNested_withoutThis(type));
    return matchArray;
  }

  getAllOfTypeNested_withoutThis() {
    return [];
  }
}
