import {
  //   initUl,
  //   initLiAsChildInList,
  //   initButton,
  initDiv,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

const blockName = "project-div";
const cssClass = {
  div: blockName,
};

export default class projectDomComponent extends baseDomComponent {
  constructor(obj) {
    super(obj, blockName);

    // [TODOS]
    // list of todo (mini view)
  }

  init() {
    this.div = initDiv(cssClass.div);

    this.div.textContent = this.obj.print(); /* temporary */

    this.div.appendChild(this.initHeader());
    this.div.appendChild(this.initMain());
    this.div.appendChild(this.initFooter());
  }
}
