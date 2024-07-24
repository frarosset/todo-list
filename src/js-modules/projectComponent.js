import baseComponent from "./baseComponent.js";
import todoListComponent from "./todoListComponent.js";

export default class projectComponent extends baseComponent {
  static defaultData = {
    ...baseComponent.defaultData,
    todoList: null /* array of todos */,
  };

  static nextId = 0;

  constructor(data) {
    super(data);
    // overwrite type
    this.type = "P";

    if (this.data.todoList == null) {
      this.data.todoList = new todoListComponent("Todos", this);
    }
  }

  print(dateFormat = projectComponent.dateFormat) {
    let str = this.printBaseInfo(dateFormat);
    str += this.data.todoList.print();
    return str;
  }

  // Getter methods

  get todos() {
    return this.data.todoList.list;
  }

  // Methods related to #data.todos property

  addTodo(data) {
    return this.data.todoList.addItem(data);
  }

  removeTodo(todo) {
    /* todo is a reference to a todo object */
    this.data.todoList.removeItem(todo);
  }

  /* note: a todo, when modified, must call this.updateDateOfEdit(), too */
}
