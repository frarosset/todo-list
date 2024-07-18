import baseComponent from "./baseComponent.js";
import todoComponent from "./todoComponent";

export default class projectComponent extends baseComponent {
  static defaultData = {
    todos: [] /* array of todos */,
  };

  static nextId = 0;

  constructor(data) {
    // set the id, if not provided (specific for the projectComponent class)
    // but do not modify data
    const dataCopy = Object.assign({}, data);
    if (dataCopy.id == null) {
      dataCopy.id = projectComponent.nextId;
      projectComponent.nextId++;
    }

    super(dataCopy);

    this.data = Object.assign({}, projectComponent.defaultData, this.data);

    // overwrite type
    this.type = "P";

    // create any todo: TODO
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
    this.data.todos.push(new todoComponent(data, this));
    this.updateDateOfEdit();
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
