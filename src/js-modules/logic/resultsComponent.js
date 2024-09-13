import { listInComponentMixin } from "./fixCircularDependenciesInComponents.js";
import genericBaseComponent from "./genericBaseComponent.js";
import PubSub from "pubsub-js";
import { uiIcons } from "../uiIcons.js";

export default class resultsComponent extends genericBaseComponent {
  static defaultData = {
    ...genericBaseComponent.defaultData,
    variable: "", // '' = search, otherwise it means filter by that variable
    value: "",
  };

  getPubSubName(str, topic = null) {
    const topicStr = topic ? `${topic}:` : "";
    return `${topicStr}${this.type}${this.id} ${str}`;
  }

  constructor(data, root, parent = null) {
    super(data, parent);

    this.root = root;
    this.type = "R";
    this.nTodo = 0;

    const todoOnly = ["imminence", "state", "priority"].includes(data.variable);
    const listsToExclude = todoOnly ? ["P", "N"] : [];

    this.initAllLists({}, listsToExclude, false); // method added via composition (see below)
    this.sortResultsInLists();

    // remove also the descendants, if any, by recursion
    const msgPubSub = (msg, list, item, apply = null) =>
      `${msg} [${list.parent.title}] (${item.title}) ${apply != null ? apply : ""}`;

    Object.values(this.data.lists).forEach((listComponent) => {
      this.nTodo += listComponent.nTodo;

      PubSub.subscribe(
        listComponent.getPubSubName("ADD ITEM", "main", false),
        (msg, item) => {
          const apply =
            this.isInResults(item, listComponent) && !listComponent.has(item);
          console.log(msgPubSub(msg, listComponent, item, apply));
          if (apply) {
            // item is a reference to a baseComponent object, listComponent is a list of results (not primary): do not notify the operation (it will be done by the items in the actual lists)
            listComponent.insertItem(item, false);
            this.refreshNTodo();
          }
        }
      );

      PubSub.subscribe(
        listComponent.getPubSubName("REMOVE ITEM", "main", false),
        (msg, item) => {
          const apply = listComponent.has(item);
          console.log(msgPubSub(msg, listComponent, item, apply));
          // item is a reference to a baseComponent object, listComponent is a list of results (not primary): do not notify the operation (it will be done by the items in the actual lists)
          if (apply) {
            listComponent.removeItem(item, false);
            this.refreshNTodo();
          }
        }
      );

      PubSub.subscribe(
        listComponent.getPubSubName("EDIT ITEM", "main", false),
        (msg, item) => {
          const hasItem = listComponent.has(item);
          const isInResults = this.isInResults(item, listComponent);
          const applyAdd = isInResults && !hasItem;
          const applyRemove = !isInResults && hasItem;
          const applyStr = `${applyAdd || applyRemove}${applyAdd ? " (add)" : applyRemove ? " (remove)" : ""}`;
          console.log(msgPubSub(msg, listComponent, item, applyStr));
          if (applyAdd) {
            // item is a reference to a baseComponent object, listComponent is a list of results (not primary): do not notify the operation (it will be done by the items in the actual lists)
            listComponent.insertItem(item, false);
            this.refreshNTodo();
          } else if (applyRemove) {
            listComponent.removeItem(item, false);
            this.refreshNTodo();
          }
        }
      );

      PubSub.subscribe(
        listComponent.getPubSubName("NTODO INCREASE", "main", false),
        (msg, item) => {
          const apply = listComponent.has(item);
          console.log(msgPubSub(msg, listComponent, item, apply));
          if (apply) {
            listComponent.increaseNTodo();
            this.increaseNTodo();
          }
        }
      );

      PubSub.subscribe(
        listComponent.getPubSubName("NTODO DECREASE", "main", false),
        (msg, item) => {
          const apply = listComponent.has(item);
          console.log(msgPubSub(msg, listComponent, item, apply));
          if (apply) {
            listComponent.decreaseNTodo();
            this.decreaseNTodo();
          }
        }
      );
    });
  }

  refreshNTodo() {
    this.nTodo = 0;
    Object.values(this.data.lists).forEach((listComponent) => {
      this.nTodo += listComponent.nTodo;
    });

    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }

  increaseNTodo(amount = 1) {
    this.nTodo += amount;
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }
  decreaseNTodo(amount = 1) {
    this.nTodo -= amount;
    PubSub.publish(this.getPubSubName("NTODO CHANGE", "main"));
  }

  isInResults(item) {
    return this.data.variable
      ? item.match(this.data.variable, this.data.value)
      : item.searchMatch(this.data.value);
  }

  sortResultsInLists() {
    // find matching items
    const resArr = this.data.variable
      ? this.root.filterByNested(this.data.variable, this.data.value)
      : this.root.search(this.data.value);

    // sort matching items in the right list
    resArr.forEach((itm) => {
      this.insertToList(itm.type, itm, false); // items arenot primary
    });
  }

  set value(value) {
    // note: this does not update the title (todo)
    this.data.value = value;
    this.refreshResults();
  }

  set variable(variable) {
    // note: this does not update the title (todo)
    this.data.variable = variable;
    this.refreshResults();
  }

  set variableAndValue([variable, value]) {
    // note: this does not update the title (todo)
    this.data.variable = variable;
    this.data.value = value;
    this.refreshResults();
  }

  refreshResults() {
    Object.values(this.data.lists).forEach((listComponent) => {
      listComponent.reset(false);
    });

    this.sortResultsInLists();
  }

  static getDefaultResultsData(variable, value, label = null) {
    if (label == null) {
      label = value;
    }
    const title = variable
      ? `Filter by ${variable}: ${label}`
      : `Search: ${label}`;
    const icon = variable ? uiIcons.filter : uiIcons.search;
    return {
      title: title,
      icon: icon,
      variable: variable,
      value: value,
    };
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
