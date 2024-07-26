import headerDomComponent from "./headerDomComponent.js";
import mainDomComponent from "./mainDomComponent.js";
import setCreditFooter from "../js-utilities/creditFooter.js";
import projectFormDomComponent from "./projectFormDomComponent.js";
import todoFormDomComponent from "./todoFormDomComponent.js";

export default class domStructure {
  constructor(root) {
    const headerDomObj = new headerDomComponent(root);
    const mainDomObj = new mainDomComponent(root);
    document.body.mainDomObj = mainDomObj;

    document.body.appendChild(headerDomObj.header);
    document.body.appendChild(mainDomObj.main);

    // Add dialogs
    const projectFormDialog = new projectFormDomComponent();
    document.body.appendChild(projectFormDialog.dialog);
    document.body.projectFormDialog = projectFormDialog;

    const todoFormDialog = new todoFormDomComponent();
    document.body.appendChild(todoFormDialog.dialog);
    document.body.todoFormDialog = todoFormDialog;

    setCreditFooter();
  }
}
