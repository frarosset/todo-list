import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initTextArea,
  initH2,
  initInput,
  initP,
  initDatalist,
  initOptionAsChildInList,
} from "../../js-utilities/commonDomComponents.js";
import {
  deleteElement,
  removeDescendants,
} from "../../js-utilities/commonDomUtilities.js";
// import { isToday, isThisYear } from "date-fns";
import { uiIcons } from "../uiIcons.js";
import { initFaIcon } from "../../js-utilities/fontAwesomeUtilities.js";

export default class baseFormDomComponent {
  static blockName = "base-form-dialog";

  static cssClass = {
    header: `header`,
    content: `content`,
    pathDiv: `path-div`,
    pathItem: `path-item`,
    dialogTitleH2: `title-h2`,
    newTagBtn: "new-tag-btn",
    tagsUl: `tags-ul`,
    tagLi: `tag-li`,
    tagInput: `tag-input`,
    tagHiddenSpan: "tag-hidden-span",
    tagsDatalist: "tags-datalist",
    tagsOption: "tags-option",
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

  constructor(root) {
    this.action = null;
    this.obj = null;
    this.root = root; // for tag lists
    // action:
    // - add --> obj is the parent, uses obj.addItem(data) method
    // - edit --> obj is the object to edit

    this.init();
  }

  // init method
  init() {
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add(this.constructor.blockName);

    this.dialog.appendChild(this.initHeader());
    this.dialog.appendChild(this.initContent());
  }

  setObjectData(obj, edit = false) {
    this.obj = obj;
    this.allTags = [...this.root.getAllTagsNested()];
    if (edit) {
      this.action = "edit";
      // fill the form input with the data
      this.setDataToEdit(obj);
      this.setPathDiv(obj);
    } else {
      this.action = "add";
      this.setPathDiv(obj.parent);
    }
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
    const action =
      this.action == "edit"
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
      "Submit",
      "",
      "submit" //type
    );

    submitBtn.setAttribute("form", this.getCssId("form"));

    return submitBtn;
  }

  initPathDiv() {
    this.pathDiv = initDiv(this.getCssClass("pathDiv"));
    return this.pathDiv;
  }

  setPathDiv(obj) {
    const initItem = (icon, label, obj) => {
      const cssItemClass = this.getCssClass("pathItem");

      const item = initP(cssItemClass, icon, "", label);
      const separator = initP(cssItemClass, null, "", `\\`);

      if (obj) {
        switch (obj.type) {
          case "P":
            item.style.fontWeight = "bold";
            break;
          case "N":
            item.style.fontStyle = "italic";
            break;
          case "T":
          default:
        }
      }

      this.pathDiv.append(item);
      this.pathDiv.append(separator);
    };

    // Add label to home page
    initItem(uiIcons.home, "", null);

    // Add label to each ancestor
    if (obj) {
      const path = obj.path;
      if (this.action == "add") {
        path.push(obj);
      }
      path.map((obj) => initItem(null, `${obj.title}`, obj));
    }
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

    form.appendChild(this.initPathDiv());
    form.appendChild(this.input.title);
    form.appendChild(this.input.description);
    form.appendChild(tagsList);

    form.addEventListener("submit", () => {
      // Get the data object
      const data = this.getDataToSubmit();

      // Perform the action to handle the data
      if (this.action == "add") {
        this.obj.addItem(data);
      } else {
        //todo
        this.obj.update(data);
      }

      // Clear the form
      this.resetForm();
    });

    return form;
  }

  /* Data and submit */

  setDataToEdit(obj) {
    this.input.title.value = obj.title;
    this.input.description.value = obj.description;
    obj.tags.forEach((tag) => this.addInputTagToList(tag));
  }

  getDataToSubmit() {
    const data = {
      title: this.input.title.value,
      description: this.input.description.value,
      tags: new Set(this.getTags()),
    };
    return data;
  }

  resetForm() {
    this.form.reset();

    // reset the tags editor
    this.input.tags.clear();
    // do not delete the first children of this.tagsList (it is the newTag button)
    const tagsListChildren = [...this.tagsList.children];
    const liTags = tagsListChildren.splice(1, tagsListChildren.length - 1);
    liTags.forEach((li) => deleteElement(li));

    removeDescendants(this.pathDiv);

    this.action = null;
    this.obj = null;
    this.allTags = [];
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
    titleInput.maxLength = 40;

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
    descriptionInput.maxLength = 1000;
    descriptionInput.resiz;

    return descriptionInput;
  }

  // Tags handling

  initTagsList() {
    const tagsList = this.initTagsUl();

    const newTag = this.initNewTagButton();
    tagsList.appendChild(newTag);

    // Use Map to store unique tags as values (not repeated, by construction)
    // and arrays of the corresponding input elements as values.
    // Use '' as key too, to keep track of empty tags that have to be filled
    // Having a '' keys means that there is an invalid empty tag that the user must fill.
    // Having an array with more than one item as value in the map, means that the tag
    // is repeated and the user must remove one of them.
    this.input.tags = new Map();

    return tagsList;
  }

  initNewTagButton() {
    const newTagBtn = initButton(
      this.getCssClass("newTagBtn"),
      this.constructor.addNewTagCallBack,
      uiIcons.new,
      "",
      ""
    );
    newTagBtn.associatedThis = this;

    const tagIcon = initFaIcon(uiIcons.tag);
    newTagBtn.append(tagIcon);

    return newTagBtn;
  }

  initTagsUl() {
    const ul = initUl(this.getCssClass("tagsUl"));
    return ul;
  }

  addInputTagToList(tagValue = "") {
    // Add only if other tags are valid
    if (!this.canAddTag()) {
      // display message todo
      this.checkAllTagInputValidity();
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
    tagInput.style.textTransform = "lowercase";
    tagInput.addEventListener("input", this.constructor.tagInputChangeCallback);
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

    const tagsDatalistId = this.getCssClass("tagsDatalist");
    const tagsDatalistClass = this.getCssClass("tagsDatalist");
    const tagsOptionClass = this.getCssClass("tagsOption");
    tagInput.setAttribute("list", tagsDatalistId);
    const datalist = initDatalist(tagsDatalistClass, tagsDatalistId);
    this.allTags.forEach((tag) => {
      initOptionAsChildInList(datalist, tagsOptionClass, tag, tag, tag);
    });
    li.appendChild(datalist);

    li.appendChild(hiddenSpan);
    li.appendChild(tagInput);
    li.appendChild(deleteTagBtn);

    if (this.addTag(tagValue, tagInput)) {
      tagInput.value = tagValue;
      tagInput.oldValue = tagValue;
      // make sure the dom is updated
      setTimeout(resize, 30); // for faster update
      setTimeout(resize, 100); // in case the previous one is too early
    }

    if (tagValue == "") {
      tagInput.focus();
    }

    return tagInput;
  }

  canAddTag() {
    return (
      this.input.tags.size == this.tagsList.children.length - 1 &&
      !this.input.tags.has("")
    );
  }

  getTags() {
    return [...this.input.tags.keys()];
  }
  validateTag(tag) {
    return tag.toLowerCase().trim();
  }
  hasTag(tag) {
    tag = this.validateTag(tag);
    return this.input.tags.has(tag);
  }
  addTag(tag, tagInput) {
    if (tag == null) {
      return false;
    }

    tag = this.validateTag(tag);
    if (!this.hasTag(tag)) {
      this.input.tags.set(tag, new Set([tagInput]));
      return true;
    } else {
      const tagInputSet = this.input.tags.get(tag);
      tagInputSet.add(tagInput);
      return false;
    }
  }
  removeTag(tag, tagInput) {
    if (tag == null || !this.hasTag(tag)) {
      return false;
    }

    tag = this.validateTag(tag);
    const tagInputSet = this.input.tags.get(tag);

    if (tagInputSet.size > 1) {
      tagInputSet.delete(tagInput);
      if (tagInputSet.size == 1) {
        const tagInput = [...tagInputSet.keys()];
        tagInput[0].setCustomValidity("");
      }
      return true;
    } else if (this.input.tags.delete(tag)) {
      return true;
    } else {
      return false;
    }
  }

  checkAllTagInputValidity() {
    for (const inputDomArray of this.input.tags.values()) {
      for (const inputDom of inputDomArray) {
        if (!inputDom.reportValidity()) {
          return;
        }
      }
    }
  }

  static tagInputChangeCallback(e) {
    const self = e.currentTarget.associatedThis;
    const tag = e.currentTarget.value;
    self.removeTag(e.currentTarget.oldValue, e.currentTarget);

    if (tag == "") {
      // display message: empty tag
      // e.currentTarget.setCustomValidity("Fill this empty tag!");
      e.currentTarget.reportValidity();

      self.addTag("", e.currentTarget);
      e.currentTarget.oldValue = "";
      return;
    }

    if (!self.addTag(tag, e.currentTarget)) {
      // display message: already present
      e.currentTarget.setCustomValidity("Remove this repeated tag.");
      e.currentTarget.reportValidity();
    } else {
      // set input as valid
      e.currentTarget.setCustomValidity("");
    }

    e.currentTarget.oldValue = tag;
  }

  static addNewTagCallBack(e) {
    const self = e.currentTarget.associatedThis;
    self.addInputTagToList();
  }

  static deleteTagCallBack(e) {
    const self = e.currentTarget.associatedThis;
    const tagLiToDelete = e.currentTarget.tagLiToDelete;
    const tagValue = e.currentTarget.associatedInput.value;

    self.removeTag(tagValue, e.currentTarget.associatedInput);
    deleteElement(tagLiToDelete);
  }
}
