import { format } from "date-fns";

export default class projectComponent {
  #data;

  static defaultData = {
    id: null,
    title: "",
    description: "",
    dateOfCreation: null,
    dateOfEdit: null,
  };
  static nextId = 0;

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

  print(dateFormat = "yyyy-MM-dd") {
    return `P${this.#data.id}) '${this.#data.title}', '${this.#data.description}' [created: ${format(this.#data.dateOfCreation, dateFormat)}, last edited: ${format(this.#data.dateOfEdit, dateFormat)}]`;
  }
}
