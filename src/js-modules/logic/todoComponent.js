import {
  format,
  formatRelative,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";
import { mod } from "../../js-utilities/mathUtilities.js";
import baseComponent from "./baseComponent.js";
import PubSub from "pubsub-js";
import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";

export default class todoComponent extends baseComponent {
  static defaultData = {
    ...baseComponent.defaultData,
    dueDate: null,
    priority: 0 /* index of todoComponent.prioritiesLabels array*/,
    state: 0 /* index of todoComponent.stateLabels array*/,
  };

  static nextId = 0;

  // see todoDomComponent.stateIcons, todoDomComponent.priorityColor
  // todoDomComponent.imminenceIcons, and todoDomComponent.imminenceColor
  // if modified
  static priorityLabels = ["none", "low", "medium", "high"];
  static stateLabels = ["todo", "work in progress", "done"];
  static doneIdx = 2;
  static imminenceLabels = [
    "none",
    "scheduled",
    "upcoming",
    "today",
    "expired",
  ];
  static noImminenceIdx = 0;
  static expiredIdx = 4;
  static completedIdx = 2;
  static imminenceRanges = [
    [0, -1] /* this is an empty range */,
    [8, Infinity],
    [1, 7],
    [0, 0],
    [-Infinity, -1],
  ];

  #imminenceIdx; /* index of todoComponent.imminenceLabels array*/

  constructor(data, parent = null, list = null) {
    super(data, parent, list);

    // overwrite type
    this.type = "T";

    // define imminence
    this.updateImminence();

    this.initAllLists(data.lists); // method added via composition (see below)
  }

  update(data) {
    super.update(data);
    this.dueDate = data.dueDate;
    this.priority = data.priority;
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

  get priorityIdx() {
    return this.data.priority;
  }

  get state() {
    return todoComponent.stateLabels[this.data.state];
  }

  get stateIdx() {
    return this.data.state;
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

  dueDateFormattedRelative() {
    return this.data.dueDate
      ? formatRelative(this.data.dueDate, new Date())
      : "none";
  }

  isCompleted() {
    return this.stateIdx == todoComponent.completedIdx;
  }

  isExpired() {
    return this.#imminenceIdx == todoComponent.expiredIdx;
  }

  // Setter methods

  validatePriority(priority) {
    return mod(priority, todoComponent.priorityLabels.length);
  }

  validateState(state) {
    return mod(state, todoComponent.stateLabels.length);
  }

  set priority(priority) {
    const validatedPriority = this.validatePriority(priority);
    if (this.data.priority !== validatedPriority) {
      this.data.priority = validatedPriority;

      PubSub.publish(this.getPubSubName("PRIORITY CHANGE", "main"));

      this.updateDateOfEdit();
    }
  }

  set state(state) {
    const validatedState = this.validateState(state);
    if (this.data.state !== validatedState) {
      this.data.state = validatedState;

      PubSub.publish(this.getPubSubName("STATE CHANGE", "main"));

      this.updateImminence(); // this depends on the state, too
      this.updateDateOfEdit();
    }
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
    const bothNull = this.data.dueDate == null && dueDate == null;
    const sameDate = isSameDay(this.data.dueDate, dueDate);
    if (!(bothNull || sameDate)) {
      this.data.dueDate = dueDate;

      PubSub.publish(this.getPubSubName("DUEDATE CHANGE", "main"));

      this.updateImminence();
      this.updateDateOfEdit();
    }
  }

  // imminence update method: note call it every time you modify this.data.dueDate
  // or at midnight (todo)
  updateImminence() {
    if (this.data.dueDate == null || this.data.state == todoComponent.doneIdx) {
      this.#imminenceIdx = todoComponent.noImminenceIdx; /* no imminence */
      PubSub.publish(this.getPubSubName("IMMINENCE CHANGE", "main"));
      return;
    }

    const today = new Date();
    const diff = differenceInCalendarDays(this.data.dueDate, today);
    for (let idx = 0; idx < todoComponent.imminenceRanges.length; idx++) {
      const range = todoComponent.imminenceRanges[idx];
      if (diff >= range[0] && diff <= range[1]) {
        this.#imminenceIdx = idx;
        PubSub.publish(this.getPubSubName("IMMINENCE CHANGE", "main"));
        return;
      }
    }

    this.#imminenceIdx = todoComponent.noImminenceIdx; /* no imminence */

    PubSub.publish(this.getPubSubName("IMMINENCE CHANGE", "main"));
  }

  // Serialization method
  toJSON() {
    const obj = super.toJSON();
    return {
      ...obj,
      dueDate: this.data.dueDate,
      priority: this.data.priority,
      state: this.data.state,
    };
  }

  // Filters and sizes

  static filterCallbacks = {
    ...baseComponent.filterCallbacks,
    state: (itm, value) => itm.stateIdx == value,
    imminence: (itm, value) => itm.imminenceIdx == value,
    priority: (itm, value) => itm.priorityIdx == value,
  };
}

// Add todoList (T), projectList (P), noteList (N) with composition (using mixin) with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList()
// - addToProjectList(data), addToTodoList(data), addToNoteList(data)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj)
listInComponentMixin(todoComponent, ["ST", "N"]);
