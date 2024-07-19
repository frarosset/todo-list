import headerDomComponent from "./headerDomComponent.js";
import mainDomComponent from "./mainDomComponent.js";

export default class domStructure {
  constructor(root) {
    const headerDomObj = new headerDomComponent(root);
    const mainDomObj = new mainDomComponent();
    document.body.mainDomObj = mainDomObj;

    document.body.appendChild(headerDomObj.header);
    document.body.appendChild(mainDomObj.main);
  }
}
