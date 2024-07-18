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

  constructor(data) {
    this.data = Object.assign({}, baseComponent.defaultData, data);

    if (this.data.id == null) {
      this.data.id = baseComponent.nextId;
      baseComponent.nextId++;
    }

    if (!this.data.dateOfCreation) {
      this.data.dateOfCreation = new Date();
    }

    if (!this.data.dateOfEdit) {
      this.data.dateOfEdit = this.data.dateOfCreation;
    }
  }

  print(dateFormat = baseComponent.dateFormat) {
    let str = `${this.data.id}) '${this.data.title}' [created: ${format(this.data.dateOfCreation, dateFormat)}, last edited: ${format(this.data.dateOfEdit, dateFormat)}]`;
    str += `\n\t${this.data.description}`;
    str += `\n\ttags: ${this.tags}`;
    return str;
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
    return format(this.data.dateOfEdit, dateFormat);
  }

  // Setter methods
  // Note: id and dateOfCreation cannot be edited
  // Note: dateOfEdit must be updated when one property in data is modified

  updateDateOfEdit() {
    this.data.dateOfEdit = new Date();
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
