import {
  //   initUl,
  //   initLiAsChildInList,
  //   initButton,
  initDiv,
  initP,
} from "../js-utilities/commonDomComponents.js";
import { isToday, isThisYear } from "date-fns";

let blockName = "base-div";
const cssClass = {
  div: () => blockName,
  footer: () => `${blockName}__footer`,
  dateOfCreationP: () => `${blockName}__date-of-creation-p`,
  dateOfEditP: () => `${blockName}__date-of-edit-p`,
};

export default class baseDomComponent {
  static dateFormatFcn = (date) => {
    if (isToday(date)) {
      return "HH:mm";
    } else if (isThisYear(date)) {
      return "MMM d";
    } else {
      return "MMM d, yyyy";
    }
  };

  constructor(obj, customBlockName = null) {
    if (customBlockName) {
      blockName = customBlockName;
      console.log(blockName, customBlockName);
    }
    this.obj = obj;
    this.init();
  }

  //   printPath() {
  //     let path = `${this.type}${this.id}`;
  //     let obj = this.parent;
  //     while (obj != null) {
  //       path = `${obj.type}${obj.id}/` + path;
  //       obj = obj.parent;
  //     }
  //     return path;
  //   }

  // init method
  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    this.div = initDiv(cssClass.div());
    // todo
    this.div.appendChild(this.initFooter(dateFormatFcn));
  }

  // components render methods

  //   initTitle() {
  //     this.obj.title = title;
  //     this.updateDateOfEdit();
  //   }

  //   initDescription() {
  //     this.obj.description = description;
  //     this.updateDateOfEdit();
  //   }

  //   initTag() {
  //     if (this.obj.tags.delete(tag)) {
  //       this.updateDateOfEdit();
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  //   get tags() {
  //     return [...this.obj.tags.keys()];
  //   }

  // Blocks initialization

  initFooter(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const footer = document.createElement("footer");
    footer.classList.add(cssClass.footer());
    footer.appendChild(this.initDateOfCreation(dateFormatFcn));
    // Show last edit only if it has been edited
    if (this.obj.hasBeenEdited())
      footer.appendChild(this.initDateOfEdit(dateFormatFcn));
    return footer;
  }

  // Components initialization

  initDateOfCreation(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const dateOfCreation = this.obj.dateOfCreation;
    const dateOfCreationFormatted = this.obj.dateOfCreationFormatted(
      dateFormatFcn(dateOfCreation)
    );
    return initP(
      cssClass.dateOfCreationP(),
      null,
      `created: ${dateOfCreationFormatted}`
    );
  }

  initDateOfEdit(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const dateOfEdit = this.obj.dateOfEdit;
    const dateOfEditFormatted = this.obj.dateOfEditFormatted(
      dateFormatFcn(dateOfEdit)
    );
    return initP(
      cssClass.dateOfEditP(),
      null,
      `last edit: ${dateOfEditFormatted}`
    );
  }
}
