import {
  //   initUl,
  //   initLiAsChildInList,
  //   initButton,
  initDiv,
} from "../js-utilities/commonDomComponents.js";

const blockName = "project-div";
const cssClass = {
  div: blockName,
};

export default class projectDomComponent {
  constructor(projectObj) {
    this.div = initDiv(cssClass.div);

    this.div.textContent = projectObj.print(); /* temporary */

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

    // this.nav.append(predefinedDiv, projectsDiv);
  }

  // helper methods
}
