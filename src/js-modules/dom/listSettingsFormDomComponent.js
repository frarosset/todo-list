import {
  initButton,
  initDiv,
  initH2,
  initOptionAsChildInList,
  initLabel,
  initSelect,
} from "../../js-utilities/commonDomComponents.js";
import { removeDescendants } from "../../js-utilities/commonDomUtilities.js";
// import { isToday, isThisYear } from "date-fns";
import { uiIcons } from "../uiIcons.js";
import { changeChildFaIcon } from "../../js-utilities/fontAwesomeUtilities.js";

export default class listSettingsDomComponent {
  static blockName = "list-settings-form-dialog";

  static cssClass = {
    header: `header`,
    content: `content`,
    dialogTitleH2: `title-h2`,
    form: "form",
    backBtn: `back-btn`,
    submitBtn: `submit-btn`,
    sortByInput: "sort-by-input",
    decscendingInput: "descending-input",
  };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }
  getCssId(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  constructor() {
    this.domObj = null;

    this.init();
  }

  // init method
  init() {
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add(this.constructor.blockName);

    this.dialog.appendChild(this.initHeader());
    this.dialog.appendChild(this.initContent());
  }

  setObjectData(domObj) {
    this.domObj = domObj;

    // fill the form input with the data
    this.setDataToEdit(domObj);

    this.setDialogTitle();
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

    this.form = this.initForm();
    contentDiv.appendChild(this.form);
    contentDiv.appendChild(this.initSubmitBtn());

    return contentDiv;
  }

  // Components initialization

  getDialogTitleString() {
    const typeOfList = { P: "Project", T: "Todo", N: "Note" };

    return `${this.domObj != null ? typeOfList[this.domObj.obj.type] : ""} list settings`;
  }

  initDialogTitle() {
    return initH2(
      this.getCssClass("dialogTitleH2"),
      null,
      this.getDialogTitleString()
    );
  }

  setDialogTitle() {
    this.dialogTitle.textContent = this.getDialogTitleString();
  }

  initBackBtn() {
    const backBtn = initButton(
      this.getCssClass("backBtn"),
      () => {
        this.dialog.close();
        this.resetForm();
      },
      uiIcons.back
    );
    return backBtn;
  }

  initSubmitBtn() {
    const submitBtn = initButton(
      this.getCssClass("submitBtn"),
      null,
      null,
      "Confirm",
      "",
      "submit" //type
    );

    submitBtn.setAttribute("form", this.getCssId("form"));

    return submitBtn;
  }

  /****************************/

  initForm() {
    const form = document.createElement("form");
    form.classList.add(this.getCssClass("form"));
    form.id = this.getCssId("form");
    form.method = "dialog";

    this.input = {};

    this.input.sortByDiv = this.initSortByInput();

    form.appendChild(this.input.sortByDiv);

    form.addEventListener("submit", () => {
      // Get the data object
      const data = this.getDataToSubmit();

      // Perform the action to handle the data
      this.domObj.updateSettings(data);

      // Clear the form
      this.resetForm();
    });

    return form;
  }

  /* Data and submit */

  setDataToEdit(domObj) {
    removeDescendants(this.sortBySelect);
    Object.keys(domObj.obj.constructor.sortCallbacks).forEach((itm) => {
      initOptionAsChildInList(
        this.sortBySelect,
        this.sortBySelect.listOfClasses.option,
        itm,
        itm
      );
    });
    this.setSortBySelect(domObj.obj.settings.sortBy);

    this.toggleDescending(domObj.obj.settings.descending);
  }

  getDataToSubmit() {
    const data = {
      sortBy: this.sortBySelect.value,
      descending: [...this.sortByDescendingBtn.classList].includes(
        "descending"
      ),
    };
    return data;
  }

  resetForm() {
    this.form.reset();
    this.domObj = null;
  }

  /*-----------------------------------------*/

  /* Sort By input Select */

  getClassesName(whichClass, classesLabel, idsLabel) {
    const baseClass = [this.getCssClass(whichClass)];

    const listOfClasses = {};
    classesLabel.forEach((itm) => {
      listOfClasses[itm] = baseClass.map((cls) => `${cls}-${itm}`);
    });

    const listOfIds = {};
    idsLabel.forEach((itm) => {
      listOfIds[itm] = `${baseClass[1]}-${itm}`;
    });

    return [baseClass, listOfClasses, listOfIds];
  }

  initSortByInput() {
    const [divClass, listOfClasses, listOfIds] = this.getClassesName(
      "sortByInput",
      ["label", "select", "option"],
      ["select"]
    );

    const div = initDiv(divClass);

    const label = initLabel(
      listOfClasses.label,
      listOfIds.select, // for
      uiIcons.sortBy,
      "",
      "Sort by: "
    );

    const select = initSelect(
      listOfClasses.select,
      listOfIds.select, // id
      "sortBy"
    );
    select.listOfClasses = listOfClasses;

    // li items are added based on the calling object

    const btn = initButton(
      this.getCssClass("descendingToggleBtn"),
      this.constructor.descendingBtnCallback,
      uiIcons.ascending,
      "",
      "",
      "button" //type
    );
    btn.self = this;

    // save reference to data
    this.sortBySelect = select;
    this.sortByDescendingBtn = btn;

    div.append(label, select, btn);

    return div;
  }

  static descendingBtnCallback(e) {
    e.currentTarget.self.toggleDescending();
  }

  setSortBySelect(value) {
    const option = [...this.sortBySelect.children].filter(
      (itm) => itm.value === value
    )[0];
    option.selected = true;
  }

  toggleDescending(setDescending = undefined) {
    const nowDescending = this.sortByDescendingBtn.classList.toggle(
      "descending",
      setDescending
    );
    const icon = nowDescending ? uiIcons.descending : uiIcons.ascending;
    changeChildFaIcon(this.sortByDescendingBtn, icon);
  }
}
