import headerDomComponent from "./headerDomComponent.js";
import mainDomComponent from "./mainDomComponent.js";
import setCreditFooter from "../../js-utilities/creditFooter.js";
import projectFormDomComponent from "./projectFormDomComponent.js";
import todoFormDomComponent from "./todoFormDomComponent.js";
import noteFormDomComponent from "./noteFormDomComponent.js";

export default class domStructure {
  constructor(root) {
    const headerDomObj = new headerDomComponent(root);
    const mainDomObj = new mainDomComponent(root);

    document.body.appendChild(headerDomObj.header);
    document.body.appendChild(mainDomObj.main);

    // Add dialogs
    const projectFormDialog = new projectFormDomComponent(root);
    document.body.appendChild(projectFormDialog.dialog);
    document.body.projectFormDialog = projectFormDialog;

    const todoFormDialog = new todoFormDomComponent(root);
    document.body.appendChild(todoFormDialog.dialog);
    document.body.todoFormDialog = todoFormDialog;

    const noteFormDialog = new noteFormDomComponent(root);
    document.body.appendChild(noteFormDialog.dialog);
    document.body.noteFormDialog = noteFormDialog;

    setCreditFooter();
  }
}
