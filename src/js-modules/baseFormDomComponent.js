import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initTextArea,
  initH2,
  initInput,
} from "../js-utilities/commonDomComponents.js";
import { deleteElement } from "../js-utilities/commonDomUtilities.js";
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
    newTagBtn: "new-tag-btn",
    tagsUl: `tags-ul`,
    tagLi: `tag-li`,
    tagInput: `tag-input`,
    tagHiddenSpan: "tag-hidden-span",
    deleteTagBtn: "delete-tag-btn",
    form: "form",
    backBtn: `back-btn`,
    submitBtn: `submit-btn`,
    titleInput: "title-input",
    descriptionInput: "description-input",
  };

  static type = "Base";
  static action = { add: "Add new", edit: "Edit" };

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }
  getCssId(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
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

    this.form = this.initForm();
    contentDiv.appendChild(this.form);
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
      null,
      null,
      "Submit",
      "",
      "submit" //type
    );

    submitBtn.setAttribute("form", this.getCssId("form"));

    return submitBtn;
  }

  initForm() {
    const form = document.createElement("form");
    form.classList.add(this.getCssClass("form"));
    form.id = this.getCssId("form");
    form.method = "dialog";

    this.input = {};

    this.input.title = this.initTitleInput();
    this.input.description = this.initDescriptionInput();

    const tagsList = this.initTagsList();
    this.tagsList = tagsList;
    this.input.tags = new Set(); /* to avoid duplicated tags*/

    form.appendChild(this.input.title);
    form.appendChild(this.input.description);
    form.appendChild(tagsList);

    form.addEventListener("submit", () => {
      console.log("submitted");
      // Get the data object
      // todo
      // Publish PubSub token to handle the data
      //todo

      // Clear the form
      this.resetForm();
    });

    return form;
  }

  /* Data and submit */

  resetForm() {
    this.form.reset();

    // reset the tags editor
    this.input.tags.clear();
    // do not delete the first children of this.tagsList (it is the newTag button)
    const tagsListChildren = [...this.tagsList.children];
    const liTags = tagsListChildren.splice(1, tagsListChildren.length - 1);
    liTags.forEach((li) => deleteElement(li));
  }

  /* init input elements */

  initTitleInput() {
    const titleInput = initInput(
      this.getCssClass("titleInput"), // class
      this.getCssId("titleInput"), // id
      "title", // name
      "Title (required)", // placeholder
      true, // required
      "title" // aria-label
    );
    titleInput.maxLength = 25;

    return titleInput;
  }

  initDescriptionInput() {
    const descriptionInput = initTextArea(
      this.getCssClass("descriptionInput"), // class
      this.getCssId("descriptionInput"), // id
      "description", // name
      "Description", // placeholder
      false, // required
      "description" // aria-label
    );
    descriptionInput.rows = 4;
    descriptionInput.cols = 25;
    descriptionInput.maxLength = 100;

    return descriptionInput;
  }

  // Tags handling

  initTagsList() {
    const tagsList = this.initTagsUl();

    const newTag = this.initNewTagButton();
    tagsList.appendChild(newTag);

    return tagsList;
  }

  initNewTagButton() {
    const newTagBtn = initButton(
      this.getCssClass("newTagBtn"),
      this.constructor.addNewTagCallBack,
      uiIcons.new,
      "",
      "tag"
    );
    newTagBtn.associatedThis = this;

    return newTagBtn;
  }

  initTagsUl() {
    const ul = initUl(this.getCssClass("tagsUl"));
    return ul;
  }

  addInputTagToList() {
    // Add only if other tags are valid todo
    if (!this.canAddTag()) {
      // display message todo
      console.log("Fix invalid (repeated or empty) tags first!");
      return;
    }

    const li = initLiAsChildInList(
      this.tagsList,
      this.getCssClass("tagLi"),
      null,
      ""
    );

    const tagInput = initInput(
      this.getCssClass("tagInput"), // class
      this.getCssId("tagInput"), // id
      "tag", // name
      "tag", // placeholder
      true, // required
      "tag" // aria-label
    );
    tagInput.maxLength = 15;
    tagInput.addEventListener(
      "change",
      this.constructor.tagInputChangeCallback
    );
    tagInput.associatedThis = this;

    /* to make tag input size fit to the value length */
    /* see https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value/38867270#38867270*/
    const hiddenSpan = document.createElement("span");
    hiddenSpan.classList.add(this.getCssClass("tagHiddenSpan"));
    function resize() {
      hiddenSpan.textContent = tagInput.value;
      tagInput.style.width = hiddenSpan.offsetWidth + "px";
    }
    resize();
    tagInput.addEventListener("input", resize);
    tagInput.addEventListener("paste", resize);

    const deleteTagBtn = initButton(
      this.getCssClass("deleteTagBtn"),
      this.constructor.deleteTagCallBack,
      uiIcons.back
    );
    deleteTagBtn.tagLiToDelete = li;
    deleteTagBtn.associatedThis = this;
    deleteTagBtn.associatedInput = tagInput;

    li.appendChild(hiddenSpan);
    li.appendChild(tagInput);
    li.appendChild(deleteTagBtn);

    tagInput.focus();
  }

  canAddTag() {
    return this.input.tags.size == this.tagsList.children.length - 1;
  }

  getTags() {
    return [...this.input.tags.keys()];
  }
  hasTag(tag) {
    return this.input.tags.has(tag);
  }
  addTag(tag) {
    if (!this.hasTag(tag)) {
      this.input.tags.add(tag);
      return true;
    } else {
      return false;
    }
  }
  removeTag(tag) {
    if (this.input.tags.delete(tag)) {
      return true;
    } else {
      return false;
    }
  }

  static tagInputChangeCallback(e) {
    const self = e.currentTarget.associatedThis;
    const tag = e.currentTarget.value;

    self.removeTag(e.currentTarget.oldTag);

    if (tag.length == "") {
      // todo display message: empty tag
      console.log("Fill this empty tag!");
      return;
    }
    if (!self.addTag(tag)) {
      // todo display message: already present
      console.log("Tag already present!");
    }

    e.currentTarget.oldTag = tag;
  }

  static addNewTagCallBack(e) {
    const self = e.currentTarget.associatedThis;
    self.addInputTagToList();
  }

  static deleteTagCallBack(e) {
    const self = e.currentTarget.associatedThis;
    const tagLiToDelete = e.currentTarget.tagLiToDelete;
    const tagValue = e.currentTarget.associatedInput.value;

    self.removeTag(tagValue);
    deleteElement(tagLiToDelete);
  }
}
