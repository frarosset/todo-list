import { initDiv, initButton } from "../js-utilities/commonDomComponents.js";
import todoDomComponent from "./todoDomComponent.js";
import { uiIcons } from "./uiIcons.js";

export default class todoDomMiniComponent extends todoDomComponent {
  static blockName = "todo-mini-div";
  static cssClass = {
    ...todoDomComponent.cssClass,
    expandBtn: `expand-btn`,
  };

  constructor(obj) {
    super(obj);
  }

  // redefine the init() method
  init() {
    this.div = initDiv(this.constructor.blockName);

    this.div.prepend(this.initExpandBtn());
    this.div.appendChild(this.initStatusBtn());
    this.div.appendChild(this.initImminenceIcon());
    this.div.appendChild(this.initPath());
    this.div.appendChild(this.initTitle());

    this.div.append(this.initOtherInfo());
    this.div.appendChild(this.initActionButtons());

    this.div.associatedTodo = this.obj;
    this.div.addEventListener("click", this.constructor.btnRenderTodoCallback);
  }

  // Block initialization
  initOtherInfo() {
    const div = initDiv(this.getCssClass("otherInfosDiv"));

    div.append(this.initDueDate(""));

    return div;
  }

  // Components initialization
  initExpandBtn() {
    const expandBtn = initButton(
      this.getCssClass("expandBtn"),
      this.constructor.btnRenderTodoCallback,
      uiIcons.expand
    );
    expandBtn.associatedTodo = this.obj;
    return expandBtn;
  }

  // callbacks
  static btnRenderTodoCallback = (e) => {
    document.body.mainDomObj.renderTodo(e.currentTarget.associatedTodo);
    e.stopPropagation();
  };
}
