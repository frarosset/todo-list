import { initDiv } from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";
import todoListDomComponent from "./todoListDomComponent.js";

export default class projectDomComponent extends baseDomComponent {
  static blockName = "project-div";

  constructor(obj) {
    super(obj);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.appendChild(this.initHeader());

    this.main = this.initMain();
    this.div.appendChild(this.main);

    const todoListDom = new todoListDomComponent(this.obj.todoList);
    this.main.appendChild(todoListDom.div);

    this.div.appendChild(this.initFooter());
  }
}
