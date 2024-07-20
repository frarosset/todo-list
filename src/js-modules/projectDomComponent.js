import {
  initUl,
  initLiAsChildInList,
  //   initButton,
  initDiv,
  initH3,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

const blockName = "project-div";
const cssClass = {
  div: blockName,
  todosDiv: `${blockName}__todos-div`,
  titleH3: `${blockName}__title-h3`,
  todosUl: `${blockName}__todos-ul`,
  todoLi: `${blockName}__todo-li`,
};

export default class projectDomComponent extends baseDomComponent {
  constructor(obj) {
    super(obj, blockName);

    // [TODOS]
    // list of todo (mini view)
  }

  init() {
    this.div = initDiv(cssClass.div);

    this.div.appendChild(this.initHeader());

    this.main = this.initMain();
    this.div.appendChild(this.main);
    this.main.appendChild(this.initTodoList());

    this.div.appendChild(this.initFooter());
  }

  // helper methods
  initTodoList() {
    const div = initDiv(cssClass.todosDiv);

    div.appendChild(initH3(cssClass.titleH3, null, "TODOS"));

    const ul = initUl(cssClass.todosUl);
    div.appendChild(ul);

    if (this.obj.todos.length) {
      this.obj.todos.forEach((todo) => {
        const li = initLiAsChildInList(
          ul,
          cssClass.todoLi,
          null,
          `${todo.print()}`
        ); /*TODO*/
        li.associatedTodo = todo;
      });

      ul.addEventListener("click", projectDomComponent.btnRenderTodoCallback);
    }

    return div;
  }

  // callbacks
  static btnRenderTodoCallback = (e) => {
    document.body.mainDomObj.renderTodo(e.target.associatedTodo);
  };
}
