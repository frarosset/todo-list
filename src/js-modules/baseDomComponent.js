import {
  initUl,
  initLiAsChildInList,
  //   initButton,
  initDiv,
  initP,
  initH2,
} from "../js-utilities/commonDomComponents.js";
import { isToday, isThisYear } from "date-fns";

let blockName = "base-div";
const cssClass = {
  div: () => blockName,
  header: () => `${blockName}__header`,
  main: () => `${blockName}__main`,
  footer: () => `${blockName}__footer`,
  pathUl: () => `${blockName}__path-ul`,
  pathLi: () => `${blockName}__path-li`,
  titleH2: () => `${blockName}__title-h2`,
  descriptionP: () => `${blockName}__description-p`,
  tagsUl: () => `${blockName}__tags-ul`,
  tagLi: () => `${blockName}__tag-li`,
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
    }
    this.obj = obj;
    this.init();
  }

  // init method
  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    this.div = initDiv(cssClass.div());
    this.div.appendChild(this.initHeader());
    this.div.appendChild(this.initMain());
    this.div.appendChild(this.initFooter(dateFormatFcn));
  }

  // Blocks initialization

  initHeader() {
    const header = document.createElement("header");
    header.classList.add(cssClass.header());

    header.appendChild(this.initPath());
    header.appendChild(this.initTitle());
    header.appendChild(this.initDescription());
    header.appendChild(this.initTags());
    return header;
  }

  initMain() {
    const main = document.createElement("main");
    main.classList.add(cssClass.main());
    return main;
  }

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

  initPath() {
    /* TODO: test + add buttons with callbacks */
    const ul = initUl(cssClass.pathUl());

    let obj = this.obj.parent;
    while (obj != null) {
      initLiAsChildInList(ul, cssClass.pathLi(), null, `${obj.title} \\`);
      obj = obj.parent;
    }

    return ul;
  }

  initTitle() {
    return initH2(cssClass.titleH2(), null, this.obj.title);
  }

  initDescription() {
    return initP(cssClass.descriptionP(), null, this.obj.description);
  }

  initTags() {
    /* TODO: test + add buttons with callbacks */
    const ul = initUl(cssClass.tagsUl());
    for (const tag of this.obj.tags) {
      initLiAsChildInList(ul, cssClass.tagLi(), null, tag);
    }
    return ul;
  }

  //   get tags() {
  //     return [...this.obj.tags.keys()];
  //   }

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
