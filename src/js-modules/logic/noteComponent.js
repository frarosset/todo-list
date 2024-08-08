import baseComponent from "./baseComponent.js";
import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";

export default class noteComponent extends baseComponent {
  static nextId = 0;

  constructor(
    data,
    parent = null,
    list = null,
    editable = true,
    listsToExclude = []
  ) {
    super(data, parent, list, editable);
    // overwrite type
    this.type = "N";

    this.initAllLists(data.lists, listsToExclude); // method added via composition (see below)
  }
}

// Add todoList (T), projectList (P), noteList (N) with composition (using mixin) with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList()
// - addToProjectList(data), addToTodoList(data), addToNoteList(data)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj)
listInComponentMixin(noteComponent, ["SN"]);
