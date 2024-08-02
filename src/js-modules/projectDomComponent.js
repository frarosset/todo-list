import baseDomComponent from "./baseDomComponent.js";
import todoListDomComponent from "./todoListDomComponent.js";

export default class projectDomComponent extends baseDomComponent {
  static blockName = "project-div";
  static associatedDialog = () => document.body.projectFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    super.init(dateFormatFcn);

    const todoListDom = new todoListDomComponent(this.obj.getTodoList());
    this.content.appendChild(todoListDom.div);
  }
}
