import {
  //   initUl,
  //   initLiAsChildInList,
  initButton,
  initDiv,
  //   initP,
  initH2,
} from "../js-utilities/commonDomComponents.js";
// import { isToday, isThisYear } from "date-fns";
import { uiIcons } from "./uiIcons.js";

export default class baseFormDomComponent {
  static blockName = "base-form-dialog";

  static cssClass = {
    header: `header`,
    content: `content`,
    // pathUl: `path-ul`,
    // pathLi: `path-li`,
    dialogTitleH2: `title-h2`,
    // descriptionP: `description-p`,
    // tagsUl: `tags-ul`,
    // tagLi: `tag-li`,
    form: "form",
    backBtn: `back-btn`,
    submitBtn: `submit-btn`,
  };

  static cssId = {
    form: "form",
    backBtn: `back-btn`,
    submitBtn: `submit-btn`,
  };

  static type = "Base";
  static action = { add: "Add new", edit: "Edit" };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }
  getCssId(element) {
    return `${this.constructor.blockName}__${this.constructor.cssId[element]}`;
  }

  constructor() {
    this.init();
  }

  // init method
  init() {
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add(this.constructor.blockName);

    this.dialog.appendChild(this.initHeader());
    this.dialog.appendChild(this.initContent());
  }

  // Blocks initialization

  initHeader() {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    this.dialogTitle = this.initDialogTitle();
    header.appendChild(this.dialogTitle);
    header.appendChild(this.initBackBtn());

    return header;
  }

  initContent() {
    const contentDiv = initDiv(this.getCssClass("content"));

    contentDiv.appendChild(this.initForm());
    contentDiv.appendChild(this.initSubmitBtn());

    return contentDiv;
  }

  // Components initialization

  getDialogTitleString(edit = false) {
    const action = edit
      ? this.constructor.action.edit
      : this.constructor.action.add;
    return `${action} ${this.constructor.type}`;
  }

  initDialogTitle() {
    return initH2(
      this.getCssClass("dialogTitleH2"),
      null,
      this.getDialogTitleString()
    );
  }

  initBackBtn() {
    const backBtn = initButton(
      this.getCssClass("backBtn"),
      () => this.dialog.close(),
      uiIcons.back
    );
    return backBtn;
  }

  initSubmitBtn() {
    const submitBtn = initButton(
      this.getCssClass("submitBtn"),
      () => this.dialog.close(), // todo
      null,
      "Submit"
    );
    submitBtn.for = this.getCssId("form");
    return submitBtn;
  }

  initForm() {
    const form = document.createElement("form");
    form.classList.add(this.getCssClass("form"));
    form.id = this.getCssId("form");
    form.textContent = "FORM TO BE DONE...";
    return form;
  }
}
