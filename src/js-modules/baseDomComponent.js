import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initP,
  initH2,
} from "../js-utilities/commonDomComponents.js";
import { isToday, isThisYear } from "date-fns";
import PubSub from "pubsub-js";
import { uiIcons } from "./uiIcons.js";

export default class baseDomComponent {
  static blockName = "base-div";

  static cssClass = {
    header: `header`,
    main: `main`,
    footer: `footer`,
    pathUl: `path-ul`,
    pathLi: `path-li`,
    pathBtn: `path-btn`,
    titleH2: `title-h2`,
    descriptionP: `description-p`,
    tagsUl: `tags-ul`,
    tagLi: `tag-li`,
    dateOfCreationP: `date-of-creation-p`,
    dateOfEditP: `date-of-edit-p`,
    backBtn: `back-btn`,
  };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  static dateFormatFcn = (date) => {
    if (isToday(date)) {
      return "HH:mm";
    } else if (isThisYear(date)) {
      return "MMM d";
    } else {
      return "MMM d, yyyy";
    }
  };

  getPubSubName(str, topic = null) {
    return this.obj.getPubSubName(str, topic);
  }

  constructor(obj) {
    this.obj = obj;
    this.init();
  }

  // init method
  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    this.div = initDiv(this.constructor.blockName);
    this.div.appendChild(this.initHeader());
    this.div.appendChild(this.initMain());
    this.div.appendChild(this.initFooter(dateFormatFcn));
  }

  // Blocks initialization

  initHeader() {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    header.appendChild(this.initBackBtn());
    header.appendChild(this.initPath());
    header.appendChild(this.initTitle());
    header.appendChild(this.initDescription());
    header.appendChild(this.initTags());
    return header;
  }

  initMain() {
    const main = document.createElement("main");
    main.classList.add(this.getCssClass("main"));
    return main;
  }

  initFooter(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const footer = document.createElement("footer");
    footer.classList.add(this.getCssClass("footer"));
    footer.appendChild(this.initDateOfCreation(dateFormatFcn));
    footer.appendChild(this.initDateOfEdit(dateFormatFcn));
    return footer;
  }

  // Components initialization

  initPath() {
    /* TODO: test + add buttons with callbacks */
    const ul = initUl(this.getCssClass("pathUl"));

    let obj = this.obj.parent;
    while (obj != null) {
      const li = initLiAsChildInList(
        ul,
        this.getCssClass("pathLi"),
        null,
        ` \\`
      );

      const btn = initButton(
        this.getCssClass("pathBtn"),
        baseDomComponent.renderObjCallback,
        null,
        `${obj.title}`
      );
      btn.objToRender = obj;

      li.prepend(btn);

      obj = obj.parent;
    }

    return ul;
  }

  initTitle() {
    return initH2(this.getCssClass("titleH2"), null, this.obj.title);
  }

  initDescription() {
    return initP(this.getCssClass("descriptionP"), null, this.obj.description);
  }

  initTags() {
    /* TODO: test + add buttons with callbacks */
    const ul = initUl(this.getCssClass("tagsUl"));
    for (const tag of this.obj.tags) {
      initLiAsChildInList(ul, this.getCssClass("tagLi"), null, tag);
    }
    return ul;
  }

  initDateOfCreation(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const dateOfCreation = this.obj.dateOfCreation;
    const dateOfCreationFormatted = this.obj.dateOfCreationFormatted(
      dateFormatFcn(dateOfCreation)
    );
    return initP(
      this.getCssClass("dateOfCreationP"),
      null,
      `created: ${dateOfCreationFormatted}`
    );
  }

  initDateOfEdit(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    const getDateOfEditFormatted = () => {
      const dateOfEdit = this.obj.dateOfEdit;
      return this.obj.dateOfEditFormatted(dateFormatFcn(dateOfEdit));
    };

    const getEditString = () => `\xa0/ last edit: ${getDateOfEditFormatted()}`;

    // Show last edit only if it has been edited
    const p = initP(
      this.getCssClass("dateOfEditP"),
      null,
      this.obj.hasBeenEdited() ? getEditString() : ""
    );

    PubSub.subscribe(this.getPubSubName("EDITED", "main"), (msg) => {
      console.log(msg);
      p.textContent = getEditString();
    });

    return p;
  }

  initBackBtn() {
    const backBtn = initButton(
      this.getCssClass("backBtn"),
      baseDomComponent.renderObjCallback,
      uiIcons.back
    );
    backBtn.objToRender = this.obj.parent;
    return backBtn;
  }

  // callbacks
  static renderObjCallback = (e) => {
    document.body.mainDomObj.renderGeneric(e.currentTarget.objToRender);
    e.stopPropagation();
  };
}
