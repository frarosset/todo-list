import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import { isToday, isThisYear } from "date-fns";
import PubSub from "pubsub-js";
import { uiIcons } from "../uiIcons.js";
import { deleteElement } from "../../js-utilities/commonDomUtilities.js";
import genericBaseDomComponent from "./genericBaseDomComponent.js";
import resultsComponent from "../logic/resultsComponent.js";

export default class baseDomComponent extends genericBaseDomComponent {
  static blockName = "base-div";

  static cssClass = {
    ...genericBaseDomComponent.cssClass,
    footer: `footer`,
    descriptionP: `description-p`,
    tagsUl: `tags-ul`,
    tagLi: `tag-li`,
    tagBtn: `tag-btn`,
    dateOfCreationP: `date-of-creation-p`,
    dateOfEditP: `date-of-edit-p`,
    actionDiv: `action-div`,
    removeBtn: `remove-btn`,
    editBtn: `edit-btn`,
    nTodoNestedIcon: `n-todo-nested-icon`,
    otherInfoDiv: `other-info-div`,
    otherInfosDiv: `other-infos-div`,
  };

  static associatedDialog = () => null; // method to fetch the dialog after its creation

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

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  // init method
  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    super.init();
    this.div.appendChild(this.initFooter(dateFormatFcn));
  }

  // Blocks initialization

  initHeader() {
    const header = super.initHeader();
    header.appendChild(this.initDescription());
    header.appendChild(this.initTags());

    if (this.obj.editable) {
      header.appendChild(this.initActionButtons());
    }

    header.append(this.initOtherInfo(false));

    return header;
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
    const ul = super.initPath();

    const customizeLiBtn = (li) => {
      const btn = li.children[0];
      const obj = btn.objToRender;

      if (obj) {
        switch (obj.type) {
          case "P":
            btn.style.fontWeight = "bold";
            break;
          case "N":
            btn.style.fontStyle = "italic";
            break;
          case "T":
          default:
        }

        // Subscribe to the change of the title of a base component, to update the interface
        PubSub.subscribe(obj.getPubSubName("TITLE CHANGE", "main"), (msg) => {
          console.log(msg);
          btn.textContent = obj.title;
        });
      }
    };

    [...ul.children].forEach((li) => customizeLiBtn(li));

    return ul;
  }

  initTitle() {
    const h2 = super.initTitle();
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
    const ul = initUl(this.getCssClass("tagsUl"));

    const initLi = (tag) => {
      const li = initLiAsChildInList(ul, this.getCssClass("tagLi"));
      const tagBtn = initButton(
        this.getCssClass("tagBtn"),
        this.constructor.tagBtnCallback,
        null,
        tag
      );
      tagBtn.tag = tag;
      tagBtn.parentObj = this.obj;

      li.appendChild(tagBtn);

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
      console.log(msg, `[${tag}]`);
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
      this.constructor.editObjCallback,
      uiIcons.edit
    );
    editBtn.self = this;
    return editBtn;
  }

  initRemoveBtn() {
    const removeBtn = initButton(
      this.getCssClass("removeBtn"),
      this.constructor.removeObjCallback,
      uiIcons.delete
    );
    removeBtn.self = this;
    return removeBtn;
  }

  initOtherInfo(showNTodoNestedIcon = true) {
    const div = initDiv(this.getCssClass("otherInfosDiv"));
    if (showNTodoNestedIcon) {
      div.appendChild(this.initNTodoNestedIcon());
    }
    return div;
  }

  initNTodoNestedIcon() {
    const cssClass = this.getCssClass("nTodoNestedIcon");
    const cssClassHidden = `${cssClass}__hidden`;

    const nTodoNestedIcon = initP(cssClass, null, this.obj.nTodoNested);
    const toggleHiddenClass = () =>
      nTodoNestedIcon.classList.toggle(
        cssClassHidden,
        this.obj.nTodoNested === 0
      );

    toggleHiddenClass();

    // Set the tooltip when hovering
    nTodoNestedIcon.title = `Nested todo yet to be done`;

    PubSub.subscribe(
      this.getPubSubName("NTODONESTED CHANGE", "main"),
      (msg) => {
        console.log(msg);
        nTodoNestedIcon.textContent = `${this.obj.nTodoNested}`;
        toggleHiddenClass();
      }
    );

    return nTodoNestedIcon;
  }

  // callbacks

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

  static tagBtnCallback = (e) => {
    const tag = e.currentTarget.tag;
    const parent = e.currentTarget.parentObj;

    const resultsData = resultsComponent.getDefaultResultsData("tag", tag);

    // refresh the whole view, to show the results of filtering by this tag
    PubSub.publish("RENDER RESULTS", { data: resultsData, parent: parent });

    e.stopPropagation();
  };
}
