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
import { deleteElement } from "../js-utilities/commonDomUtilities.js";

export default class baseDomComponent {
  static blockName = "base-div";

  static cssClass = {
    header: `header`,
    content: `content`,
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
    actionDiv: `action-div`,
    removeBtn: `remove-btn`,
    editBtn: `edit-btn`,
  };

  static associatedDialog = () => null; // method to fetch the dialog after its creation

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

    this.header = this.initHeader();
    this.div.appendChild(this.header);

    this.content = this.initContent();
    this.div.appendChild(this.content);

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
    header.appendChild(this.initActionButtons());

    return header;
  }

  initContent() {
    const contentDiv = initDiv(this.getCssClass("content"));
    return contentDiv;
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

    // Add link to home page
    const li = initLiAsChildInList(ul, this.getCssClass("pathLi"), null, ` \\`);

    const btn = initButton(
      this.getCssClass("pathBtn"),
      baseDomComponent.renderObjCallback,
      uiIcons.home
    );
    btn.objToRender = null;

    li.prepend(btn);

    return ul;
  }

  initTitle() {
    const h2 = initH2(this.getCssClass("titleH2"), null, this.obj.title);

    // Subscribe to the change of the title of a base component, to update the interface
    PubSub.subscribe(this.getPubSubName("TITLE CHANGE", "main"), (msg) => {
      console.log(msg);
      h2.textContent = this.obj.title;
    });

    return h2;
  }

  initDescription() {
    const p = initP(
      this.getCssClass("descriptionP"),
      null,
      this.obj.description
    );

    // Subscribe to the change of the description of a base component, to update the interface
    PubSub.subscribe(
      this.getPubSubName("DESCRIPTION CHANGE", "main"),
      (msg) => {
        console.log(msg);
        p.textContent = this.obj.description;
      }
    );

    return p;
  }

  initTags() {
    /* TODO: test + add buttons with callbacks */
    const ul = initUl(this.getCssClass("tagsUl"));

    const initLi = (tag) => {
      const li = initLiAsChildInList(ul, this.getCssClass("tagLi"), null, tag);

      // Subscribe to the add tag of a base component, to update the interface
      PubSub.subscribe(
        this.getPubSubName(`TAG REMOVE ${tag}`, "main"),
        (msg) => {
          console.log(msg);

          PubSub.unsubscribe(this.getPubSubName(`TAG REMOVE ${tag}`, "main"));

          deleteElement(li);
        }
      );
    };

    for (const tag of this.obj.tags) {
      initLi(tag);
    }

    // Subscribe to the add tag of a base component, to update the interface
    PubSub.subscribe(this.getPubSubName("TAG ADD", "main"), (msg, tag) => {
      console.log(msg, tag);
      initLi(tag);
    });

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

  initActionButtons() {
    const div = initDiv(this.getCssClass("actionDiv"));

    div.appendChild(this.initEditBtn());

    if (this.obj.list) {
      // remove only if the component is part of a list
      div.appendChild(this.initRemoveBtn());
    }

    return div;
  }

  initEditBtn() {
    const editBtn = initButton(
      this.getCssClass("editBtn"),
      baseDomComponent.editObjCallback,
      uiIcons.edit
    );
    editBtn.self = this;
    return editBtn;
  }

  initRemoveBtn() {
    const removeBtn = initButton(
      this.getCssClass("removeBtn"),
      baseDomComponent.removeObjCallback,
      uiIcons.delete
    );
    removeBtn.self = this;
    return removeBtn;
  }

  // callbacks
  static renderObjCallback = (e) => {
    PubSub.publish("RENDER GENERIC", e.currentTarget.objToRender);
    e.stopPropagation();
  };

  static editObjCallback = (e) => {
    const self = e.currentTarget.self;
    const objToEdit = self.obj;
    const associatedDialog = self.constructor.associatedDialog();

    if (associatedDialog != null) {
      associatedDialog.setObjectData(objToEdit, true);
      associatedDialog.dialog.showModal();
    }

    e.stopPropagation();
  };

  updateView(modifiedObj) {
    // refresh the whole view, to show the parent
    PubSub.publish("RENDER GENERIC", modifiedObj.parent);
  }

  static removeObjCallback = (e) => {
    const self = e.currentTarget.self;
    const objToDelete = self.obj;

    objToDelete.list.removeItem(objToDelete);
    self.updateView(objToDelete);

    e.stopPropagation();
  };
}
