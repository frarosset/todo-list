import { initDiv } from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

const blockName = "todo-div";
const cssClass = {
  div: blockName,
};

export default class projectDomComponent extends baseDomComponent {
  constructor(obj) {
    super(obj, blockName);
  }

  init() {
    this.div = initDiv(cssClass.div);

    this.div.appendChild(this.initHeader());

    this.main = this.initMain();
    this.div.appendChild(this.main);

    this.div.appendChild(this.initFooter());
  }
}
