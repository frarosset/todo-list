import baseComponent from "./baseComponent.js";
import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";

export default class projectComponent extends baseComponent {
  static nextId = 0;

  constructor(data, parent = null, list = null, editable = true) {
    super(data, parent, list, editable);
    // overwrite type
    this.type = "P";

    this.initAllLists(data.lists); // method added via composition (see below)
  }
}

// Add todoList (T), projectList (P), noteList (N) with composition (using mixin) with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList()
// - addToProjectList(data), addToTodoList(data), addToNoteList(data)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj)
listInComponentMixin(projectComponent, ["T", "SP", "N"]);
