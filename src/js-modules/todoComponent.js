import { format } from "date-fns";

export default class todoComponent {
  #data;

  static priorityLabels = ["none", "low", "medium", "high"];
  static stateLabels = ["todo", "wip", "done"];
  static imminenceLabels = ["none", "upcoming", "due soon", "today", "expired"];

  static defaultData = {
    id: null,
    title: "",
    description: "",

    dueDate: null,
    priority: 0 /* index of todoComponent.prioritiesLabels array*/,
    state: 0 /* index of todoComponent.stateLabels array*/,
    imminence: 0 /* index of todoComponent.imminenceLabels array*/,
    associatedProjectId: null /* id of the associated project */,
    tags: [],

    dateOfCreation: null,
    dateOfEdit: null,
  };
  static nextId = 0;

  constructor(data) {
    this.#data = Object.assign({}, todoComponent.defaultData, data);

    if (!this.#data.id) {
      this.#data.id = todoComponent.nextId;
      todoComponent.nextId++;
    }

    if (!this.#data.dateOfCreation) {
      this.#data.dateOfCreation = new Date();
    }

    if (!this.#data.dateOfEdit) {
      this.#data.dateOfEdit = this.#data.dateOfCreation;
    }
  }

  print(dateFormat = "yyyy-MM-dd") {
    const str1 = `P${this.#data.associatedProjectId})/T${this.#data.id}) '${this.#data.title}', '${this.#data.description}' [created: ${format(this.#data.dateOfCreation, dateFormat)}, last edited: ${format(this.#data.dateOfEdit, dateFormat)}]\n`;
    const str2 = `\t due date:  ${this.#data.dueDate ? format(this.#data.dueDate, dateFormat) : "none"}, priority: ${this.#data.priority}, state: ${this.#data.state}, imminence: ${this.#data.imminence}\n`;
    const str3 = `\t tags:  ${this.#data.tags}`;

    return str1 + str2 + str3;
  }
}
