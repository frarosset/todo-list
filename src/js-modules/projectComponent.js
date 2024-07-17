import { format } from "date-fns";

export default class projectComponent {
  #data;

  static defaultData = {
    id: null,
    title: "",
    description: "",
    dateOfCreation: null,
    dateOfEdit: null,
    tags: new Set() /* to avoid duplicated tags*/,
    todosArray: [] /* array of todos */,
  };
  static nextId = 0;
  static dateFormat = "yyyy-MM-dd hh:mm:ss";

  constructor(data) {
    this.#data = Object.assign({}, projectComponent.defaultData, data);

    if (!this.#data.id) {
      this.#data.id = projectComponent.nextId;
      projectComponent.nextId++;
    }

    if (!this.#data.dateOfCreation) {
      this.#data.dateOfCreation = new Date();
    }

    if (!this.#data.dateOfEdit) {
      this.#data.dateOfEdit = this.#data.dateOfCreation;
    }
  }

  print(dateFormat = projectComponent.dateFormat) {
    let str = `P${this.#data.id}) '${this.#data.title}' [created: ${format(this.#data.dateOfCreation, dateFormat)}, last edited: ${format(this.#data.dateOfEdit, dateFormat)}]`;
    str += `\n\t${this.#data.description}`;
    str += `\n\ttags: ${this.tags}`;
    str += `\n\tprojects: TODO`;
    return str;
  }

  // Getter methods

  get id() {
    return this.#data.id;
  }

  get title() {
    return this.#data.title;
  }

  get description() {
    return this.#data.description;
  }

  get dateOfCreation() {
    return this.#data.dateOfCreation;
  }

  get dateOfEdit() {
    return this.#data.dateOfEdit;
  }

  get todosArray() {
    return this.#data.todosArray;
  }

  get tags() {
    return [...this.#data.tags.keys()];
  }

  dateOfCreationFormatted(dateFormat = projectComponent.dateFormat) {
    return format(this.#data.dateOfCreation, dateFormat);
  }

  dateOfEditFormatted(dateFormat = projectComponent.dateFormat) {
    return format(this.#data.dateOfEdit, dateFormat);
  }

  // Setter methods
  // Note: id and dateOfCreation cannot be edited
  // Note: dateOfEdit can only be updated via a private method, when one property in data is modified

  #updateDateOfEdit() {
    this.#data.dateOfEdit = new Date();
  }

  set title(title) {
    this.#data.title = title;
    this.#updateDateOfEdit();
  }

  set description(description) {
    this.#data.description = description;
    this.#updateDateOfEdit();
  }

  // Methods related to #data.tags property
  // addTag and removeTag return true if the object is modified, false otherwise
  hasTag(tag) {
    return this.#data.tags.has(tag);
  }

  addTag(tag) {
    if (!this.hasTag(tag)) {
      this.#data.tags.add(tag);
      this.#updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }

  removeTag(tag) {
    if (this.#data.tags.delete(tag)) {
      this.#updateDateOfEdit();
      return true;
    } else {
      return false;
    }
  }

  // TODO: edit todosArray (add new / delete / modify?)
}
