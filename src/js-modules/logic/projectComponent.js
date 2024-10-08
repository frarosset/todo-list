import baseComponent from "./baseComponent.js";
import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";
import { uiIcons } from "../uiIcons.js";
import PubSub from "pubsub-js";

export default class projectComponent extends baseComponent {
  static nextId = 0;
  static icon = uiIcons.project;

  constructor(
    data,
    parent = null,
    list = null,
    editable = true,
    listsToExclude = []
  ) {
    super(data, parent, list, editable);
    // overwrite type
    this.type = "P";

    this.initAllLists(data.lists, listsToExclude); // method added via composition (see below)
  }

  // If you redefine the setter, the getter is to be redefined too
  set title(title) {
    super.title = title;
    PubSub.publish("EDIT TITLE PROJECT", this);
  }
  get title() {
    return super.title;
  }
}

// Add todoList (T), projectList (P), noteList (N) with composition (using mixin) with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList(), getList(type)
// - addToProjectList(data), addToTodoList(data), addToNoteList(data), addToList(type,data)
// - insertToProjectList(obj), insertToTodoList(obj), insertToNoteList(obj), insertToList(type,obj)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj), removeToList(type,data)
listInComponentMixin(projectComponent, ["T", "SP", "N"]);
