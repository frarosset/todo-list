import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";
import genericBaseComponent from "./genericBaseComponent.js";
import PubSub from "pubsub-js";

export default class resultsComponent extends genericBaseComponent {
  static defaultData = {
    ...genericBaseComponent.defaultData,
    variable: "", // '' = search, otherwise it means filter by that variable
    value: "",
  };

  constructor(data, root, parent = null) {
    super(data, parent);

    this.root = root;
    this.type = "R";

    this.initAllLists({}, [], false); // method added via composition (see below)
    this.sortResultsInLists();

    // remove also the descendants, if any, by recursion
    Object.values(this.data.lists).forEach((listComponent) => {
      PubSub.subscribe(
        listComponent.getPubSubName("REMOVE ITEM", "main", false),
        (msg, item) => {
          console.log(msg, `[${item.pathAndThisStr}]`);
          listComponent.removeItem(item, false); // item is a reference to a baseComponent object, do not notify the operation (it will be done by the items in the actual lists)
        }
      );
    });
  }

  sortResultsInLists() {
    // find matching items
    const resArr = this.data.variable
      ? this.root.filterByNested(this.data.variable, this.data.value)
      : this.root.search(this.data.value);

    // sort matching items in the right list
    resArr.forEach((itm) => {
      this.insertToList(itm.type, itm);
    });
  }
}

// Add todoList (T), projectList (P), noteList (N) with composition (using mixin) with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList(), getList(type)
// - addToProjectList(data), addToTodoList(data), addToNoteList(data), addToList(type,data)
// - insertToProjectList(obj), insertToTodoList(obj), insertToNoteList(obj), insertToList(type,obj)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj), removeToList(type,data)
listInComponentMixin(resultsComponent, ["T", "P", "N"]);
