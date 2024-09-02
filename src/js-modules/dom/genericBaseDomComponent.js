import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initH2,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import PubSub from "pubsub-js";
import { uiIcons } from "./uiIcons.js";

export default class genericBaseDomComponent {
  static blockName = "base-view-div";

  static cssClass = {
    header: `header`,
    content: `content`,
    pathUl: `path-ul`,
    pathLi: `path-li`,
    pathBtn: `path-btn`,
    titleH2: `title-h2`,
    titleIcon: `title-icon`,
    backBtn: `back-btn`,
  };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  // obj properties: title, icon, parent, path
  constructor(obj, showPath = true) {
    this.obj = obj;
    this.showPath = showPath;
    this.init();
  }

  // init method
  init() {
    this.div = initDiv(this.constructor.blockName);

    this.header = this.initHeader();
    this.div.appendChild(this.header);

    this.content = this.initContent();
    this.div.appendChild(this.content);
  }

  // Blocks initialization

  initHeader() {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    header.appendChild(this.initBackBtn());
    if (this.showPath) {
      header.appendChild(this.initPath());
    }
    header.appendChild(this.initIcon());
    header.appendChild(this.initTitle());

    return header;
  }

  initContent() {
    const contentDiv = initDiv(this.getCssClass("content"));
    return contentDiv;
  }

  // Components initialization

  initPath() {
    const ul = initUl(this.getCssClass("pathUl"));

    const initLiBtn = (icon, label, obj) => {
      const cssLiClass = this.getCssClass("pathLi");
      const cssBtnClass = this.getCssClass("pathBtn");
      const callback = this.constructor.renderObjCallback;

      const li = initLiAsChildInList(ul, cssLiClass, null, ` \\`);

      const btn = initButton(cssBtnClass, callback, icon, "", label);
      btn.objToRender = obj;

      li.prepend(btn);
    };

    // Add link to home page
    initLiBtn(uiIcons.home, "", null);

    // Add link to each ancestor
    if (this.obj.path) {
      this.obj.path.forEach((obj) => initLiBtn(null, `${obj.title}`, obj));
    }

    return ul;
  }

  initIcon() {
    return initP(this.getCssClass("titleIcon"), this.obj.icon);
  }

  initTitle() {
    const h2 = initH2(this.getCssClass("titleH2"), null, "", this.obj.title);
    return h2;
  }

  initBackBtn() {
    const backBtn = initButton(
      this.getCssClass("backBtn"),
      this.constructor.renderObjCallback,
      uiIcons.back
    );
    backBtn.objToRender = this.obj.parent; // home
    return backBtn;
  }

  // callbacks
  static renderObjCallback = (e) => {
    PubSub.publish("RENDER GENERIC", e.currentTarget.objToRender);
    e.stopPropagation();
  };
}
