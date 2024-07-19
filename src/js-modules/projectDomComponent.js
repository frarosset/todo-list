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

    // this.div = initDiv(cssClass.div);

    //  this.div.textContent = projectObj.print(); /* temporary */

    // TODO:

    // [HEADER]
    // path
    // title
    // description
    // tags

    // [TODOS]
    // list of todo (mini view)

    // [FOOTER]
    // info of creation time / last edit
  }

  init() {
    this.div = initDiv(cssClass.div);

    this.div.textContent = this.obj.print(); /* temporary */

    this.div.appendChild(this.initFooter());
  }

  // helper methods
}
