import headerDomComponent from "./headerDomComponent.js";

export default class domStructure {
  constructor(root) {
    const headerObj = new headerDomComponent(root);
    document.body.appendChild(headerObj.header);
  }
}
