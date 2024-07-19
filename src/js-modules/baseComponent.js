import { format } from "date-fns";

export default class baseComponent {
  data;

  static defaultData = {
    id: null,
    title: "",
    description: "",
    tags: new Set() /* to avoid duplicated tags*/,
    dateOfCreation: null,
    dateOfEdit: null,
  };
  static nextId = 0;
  static dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

  constructor(data, parent = null) {
    this.data = Object.assign({}, baseComponent.defaultData, data);

    if (this.data.id == null) {
      this.data.id = baseComponent.nextId;
      baseComponent.nextId++;
    }

    if (!this.data.dateOfCreation) {
      this.data.dateOfCreation = new Date();
    }

    // if (!this.data.dateOfEdit) {
    //   this.data.dateOfEdit = this.data.dateOfCreation;
    // }

    this.parent = parent;
    this.type = "B";
  }

  // print functions

  printPath() {
    let path = `${this.type}${this.id}`;
    let obj = this.parent;
    while (obj != null) {
      path = `${obj.type}${obj.id}/` + path;
      obj = obj.parent;
    }
    return path;
  }

  printBaseInfo(dateFormat = baseComponent.dateFormat) {
    let str = `${this.printPath()}) '${this.title}' [created: ${this.dateOfCreationFormatted(dateFormat)}, last edited: ${this.dateOfEditFormatted(dateFormat)}]`;
    str += `\n\t${this.description}`;
    str += `\n\ttags: ${this.tags}`;
    return str;
  }

  print(dateFormat = baseComponent.dateFormat) {
    return this.printBaseInfo(dateFormat);
  }

  // Getter methods

  get id() {
    return this.data.id;
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
    }
  }

  set title(title) {
    this.data.title = title;
    this.updateDateOfEdit();
  }

  set description(description) {
    this.data.description = description;
    this.updateDateOfEdit();
  }

  // Methods related to data.tags property
  // addTag and removeTag return true if the object is modified, false otherwise

  hasTag(tag) {
    return this.data.tags.has(tag);
  }

  addTag(tag) {
    if (!this.hasTag(tag)) {
      this.data.tags.add(tag);
      this.updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }

  removeTag(tag) {
    if (this.data.tags.delete(tag)) {
      this.updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }
}
