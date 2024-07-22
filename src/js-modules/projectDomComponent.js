import {
  initUl,
  initLiAsChildInList,
  //   initButton,
  initDiv,
  initH3,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";
import todoDomMiniComponent from "./todoDomMiniComponent.js";

export default class projectDomComponent extends baseDomComponent {
  static blockName = "project-div";

  static cssClass = {
    ...baseDomComponent.cssClass,
    todosDiv: `todos-div`,
    titleH3: `title-h3`,
    todosUl: `todos-ul`,
    todoLi: `todo-li`,
  };

  constructor(obj) {
    super(obj);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.appendChild(this.initHeader());

    this.main = this.initMain();
    this.div.appendChild(this.main);
    this.main.appendChild(this.initTodoList());

    this.div.appendChild(this.initFooter());
  }

  // helper methods
  initTodoList() {
    const div = initDiv(this.getCssClass("todosDiv"));

    div.appendChild(initH3(this.getCssClass("titleH3"), null, "TODOS"));

    const ul = initUl(this.getCssClass("todosUl"));
    div.appendChild(ul);

    if (this.obj.todos.length) {
      this.obj.todos.forEach((todo) => {
        const li = initLiAsChildInList(ul, this.getCssClass("todoLi"));

        li.associatedTodo = todo;
        const miniTodo = new todoDomMiniComponent(todo);
        li.appendChild(miniTodo.div);
        li.addEventListener("click", projectDomComponent.btnRenderTodoCallback);
      });
    }

    return div;
  }

  // callbacks
  static btnRenderTodoCallback = (e) => {
    document.body.mainDomObj.renderTodo(e.currentTarget.associatedTodo);
  };
}
