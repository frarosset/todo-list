import baseComponent from "./baseComponent.js";
import todoComponent from "./todoComponent";

export default class projectComponent extends baseComponent {
  // the following default data are specific to projectComponent class
  // and will be merged with baseComponent.defaultData in the constructor
  static defaultData = {
    ...baseComponent.defaultData,
    todos: [] /* array of todos */,
  };

  static nextId = 0;

  constructor(data) {
    super(data);
    // overwrite type
    this.type = "P";

    // create any todo: TODO
    if (this.data.todos.length == 0) {
      this.data.todos = [];
    }
  }

  print(dateFormat = projectComponent.dateFormat) {
    let str = this.printBaseInfo(dateFormat);
    if (this.data.todos.length) {
      str += `\n\n\t------------------------------------`;
      this.data.todos.forEach((todo) => {
        str += `\n\n${todo.print()}`;
      });
    }
    return str;
  }

  // Getter methods

  get todos() {
    return this.data.todos;
  }

  // Methods related to #data.todos property

  addTodo(data) {
    const todo = new todoComponent(data, this);
    this.data.todos.push(todo);
    this.updateDateOfEdit();
    return todo;
  }

  removeTodo(todo) {
    /* todo is a reference to a todo object */
    const idx = this.data.todos.indexOf(todo);
    if (idx >= 0) {
      this.data.todos.splice(idx, 1);
      this.updateDateOfEdit();
    }
  }

  /* note: a todo, when modified, must call this.updateDateOfEdit(), too */
}
