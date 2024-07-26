import headerDomComponent from "./headerDomComponent.js";
import mainDomComponent from "./mainDomComponent.js";
import setCreditFooter from "../js-utilities/creditFooter.js";
import baseFormDomComponent from "./baseFormDomComponent.js";

export default class domStructure {
  constructor(root) {
    const headerDomObj = new headerDomComponent(root);
    const mainDomObj = new mainDomComponent(root);
    document.body.mainDomObj = mainDomObj;

    document.body.appendChild(headerDomObj.header);
    document.body.appendChild(mainDomObj.main);

    // Add dialogs
    const projectFormDialog = new baseFormDomComponent(); //tofix
    document.body.appendChild(projectFormDialog.dialog); //tofix
    document.body.projectFormDialog = projectFormDialog; //tofix

    setCreditFooter();
  }
}
