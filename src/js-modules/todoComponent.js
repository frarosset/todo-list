import { format, differenceInCalendarDays } from "date-fns";
import { mod } from "../js-utilities/mathUtilities.js";
import baseComponent from "./baseComponent.js";

export default class todoComponent extends baseComponent {
  static defaultData = {
    dueDate: null,
    priority: 0 /* index of todoComponent.prioritiesLabels array*/,
    state: 0 /* index of todoComponent.stateLabels array*/,
  };

  static nextId = 0;

  static priorityLabels = ["none", "low", "medium", "high"];
  static stateLabels = ["todo", "wip", "done"];
  static imminenceLabels = [
    "none",
    "scheduled",
    "upcoming",
    "today",
    "expired",
  ];
  static noImminenceIdx = 0;
  static imminenceRanges = [
    [0, -1] /* this is an empty range */,
    [8, Infinity],
    [1, 7],
    [0, 0],
    [-Infinity, -1],
  ];

  #imminenceIdx; /* index of todoComponent.imminenceLabels array*/

  constructor(data, parent = null) {
    // set the id, if not provided (specific for the todoComponent class)
    // but do not modify data
    const dataCopy = Object.assign({}, data);
    if (dataCopy.id == null) {
      dataCopy.id = todoComponent.nextId;
      todoComponent.nextId++;
    }

    super(dataCopy, parent);

    this.data = Object.assign({}, todoComponent.defaultData, this.data);

    // overwrite type
    this.type = "T";

    // define imminence
    this.updateImminence();
  }

  print(dateFormat = todoComponent.dateFormat) {
    let str = this.printBaseInfo(dateFormat);
    str += `\n\tdue date: ${this.dueDateFormatted(dateFormat)}, priority: ${this.priority}, state: ${this.state}, imminence: ${this.imminence}`;
    return str;
  }

  // Getter methods
  get priority() {
    return todoComponent.priorityLabels[this.data.priority];
  }

  get state() {
    return todoComponent.stateLabels[this.data.state];
  }

  get imminence() {
    return todoComponent.imminenceLabels[this.#imminenceIdx];
  }

  get imminenceIdx() {
    return this.#imminenceIdx;
  }

  get dueDate() {
    return this.data.dueDate;
  }

  dueDateFormatted(dateFormat = todoComponent.dateFormat) {
    return this.data.dueDate ? format(this.data.dueDate, dateFormat) : "none";
  }

  // Setter methods

  validatePriority(priority) {
    return mod(priority, todoComponent.priorityLabels.length);
  }

  validateState(state) {
    return mod(state, todoComponent.stateLabels.length);
  }

  set priority(priority) {
    this.data.priority = this.validatePriority(priority);
    this.updateDateOfEdit();
  }

  set state(state) {
    this.data.state = this.validateState(state);
    this.updateDateOfEdit();
  }

  togglePriority() {
    // this uses the priority setter method
    this.priority = this.data.priority + 1;
  }

  togglePriorityReverse() {
    // this uses the priority setter method
    this.priority = this.data.priority - 1;
  }

  toggleState() {
    // this uses the state setter method
    this.state = this.data.state + 1;
  }

  toggleStateReverse() {
    // this uses the state setter method
    this.state = this.data.state - 1;
  }

  set dueDate(dueDate) {
    this.data.dueDate = dueDate;
    this.updateDateOfEdit();
    this.updateImminence();
  }

  // imminence update method: note call it every time you modify this.data.dueDate
  // or at midnight (todo)
  updateImminence() {
    if (this.data.dueDate == null) {
      this.#imminenceIdx = todoComponent.noImminenceIdx; /* no imminence */
      return;
    }

    const today = new Date();
    const diff = differenceInCalendarDays(this.data.dueDate, today);
    for (let idx = 0; idx < todoComponent.imminenceRanges.length; idx++) {
      const range = todoComponent.imminenceRanges[idx];
      if (diff >= range[0] && diff <= range[1]) {
        this.#imminenceIdx = idx;
        return;
      }
    }

    this.#imminenceIdx = todoComponent.noImminenceIdx; /* no imminence */
  }
}