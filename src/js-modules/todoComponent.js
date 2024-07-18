import { format } from "date-fns";
import baseComponent from "./baseComponent.js";

export default class todoComponent extends baseComponent {
  static defaultData = {
    dueDate: null,
    priority: 0 /* index of todoComponent.prioritiesLabels array*/,
    state: 0 /* index of todoComponent.stateLabels array*/,
    imminence: 0 /* index of todoComponent.imminenceLabels array*/,
    associatedProjectId: null /* id of the associated project */,
  };

  static nextId = 0;

  static priorityLabels = ["none", "low", "medium", "high"];
  static stateLabels = ["todo", "wip", "done"];
  static imminenceLabels = ["none", "upcoming", "due soon", "today", "expired"];

  constructor(data) {
    // set the id, if not provided (specific for the todoComponent class)
    // but do not modify data
    const dataCopy = Object.assign({}, data);
    if (dataCopy.id == null) {
      dataCopy.id = todoComponent.nextId;
      todoComponent.nextId++;
    }

    super(dataCopy);

    this.data = Object.assign({}, todoComponent.defaultData, this.data);
  }

  print(dateFormat = todoComponent.dateFormat) {
    let str = `P${this.data.associatedProjectId}/T${this.data.id}) '${this.data.title}' [created: ${format(this.data.dateOfCreation, dateFormat)}, last edited: ${format(this.data.dateOfEdit, dateFormat)}]`;
    str += `\n\t${this.data.description}`;
    str += `\n\ttags: ${this.tags}`;
    str += `\n\tdue date:  ${this.data.dueDate ? format(this.data.dueDate, dateFormat) : "none"}, priority: ${this.data.priority}, state: ${this.data.state}, imminence: ${this.data.imminence}`;
    return str;
  }
}
