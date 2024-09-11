import {
  initUl,
  initLiAsChildInList,
  initDiv,
  initH3,
  initButton,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import { deleteElement } from "../../js-utilities/commonDomUtilities.js";
import baseDomComponent from "./baseDomComponent.js";
import { changeChildFaIcon } from "../../js-utilities/fontAwesomeUtilities.js";
import { uiIcons } from "./uiIcons.js";
import PubSub from "pubsub-js";

export default class baseListDomComponent {
  static blockName = "base-list-div";
  static cssClass = {
    titleH3: `title-h3`,
    header: "header",
    heading: "heading",
    size: "size",
    ul: `ul`,
    li: `li`,
    newItemBtn: "new-item-btn",
    settingsBtn: "settings-btn",
    expandBtn: "expand-btn",
  };

  static associatedDialog = () => null; // method to fetch the dialog after its creation
  static settingsDialog = () => document.body.listSettingsFormDialog;

  #listMap; // A Map object that stores (obj, div) pairs, where obj is a reference to a baseComponent instance and used as the key, and div the dom div representing it

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  getPubSubName(str, topic = null, includeParent = true) {
    return this.obj.getPubSubName(str, topic, includeParent);
  }

  constructor(objList, showPath = true) {
    this.obj = objList;
    this.showPath = showPath;
    this.#listMap = new Map();
    this.init();
  }

  // Methods

  initItemDom(item) {
    return new baseDomComponent(item, this.showPath);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.ul = this.initUl();

    this.div.appendChild(this.initHeader(this.ul));
    this.div.appendChild(this.ul);

    this.addMultipleDomItems(this.obj.list);

    PubSub.subscribe(this.getPubSubName("ADD ITEM", "main"), (msg, item) => {
      console.log(msg);
      this.addDomItem(item);
    });

    PubSub.subscribe(this.getPubSubName("REMOVE ITEM", "main"), (msg, item) => {
      console.log(msg, `[${item.pathAndThisStr}]`);
      this.removeItem(item); // item is a reference to a baseComponent object
    });

    PubSub.subscribe(this.getPubSubName("EDIT ITEM", "main", false), (msg) => {
      console.log(msg);
      this.sortBy();
    });
  }

  /* Blocks */

  initHeader(ul) {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    const div = initDiv(this.getCssClass("heading"));
    div.appendChild(this.initName());
    div.appendChild(this.initSize());
    header.appendChild(div);

    header.appendChild(this.initSettingsBtn());

    const expandBtn = this.initExpandBtn(ul);
    header.appendChild(expandBtn);

    if (this.obj.editable) {
      header.appendChild(this.initNewItemBtn());
    }

    header.ul = ul;
    header.btn = expandBtn;
    header.addEventListener("click", baseListDomComponent.toggleVisibility);

    return header;
  }

  initUl() {
    const ul = initUl(this.getCssClass("ul"));
    return ul;
  }

  /* Components */

  initName() {
    return initH3(
      this.getCssClass("titleH3"),
      this.obj.icon,
      "",
      this.obj.name
    );
  }

  initSize() {
    const p = initP(this.getCssClass("size"), null, this.obj.sizeInfo.str);

    for (const token of this.obj.sizeInfo.tokens) {
      PubSub.subscribe(token, (msg) => {
        console.log(msg);
        p.textContent = this.obj.sizeInfo.str;
      });
    }

    return p;
  }

  initExpandBtn(ul) {
    const expandBtn = initButton(
      this.getCssClass("expandBtn"),
      baseListDomComponent.toggleVisibility,
      uiIcons.hide
    );
    expandBtn.ul = ul;
    expandBtn.btn = expandBtn;

    return expandBtn;
  }

  initNewItemBtn() {
    const newItemBtn = initButton(
      this.getCssClass("newItemBtn"),
      baseListDomComponent.showDialog,
      uiIcons.new
    );
    newItemBtn.associatedDialog = this.constructor.associatedDialog;
    newItemBtn.parentObj = this.obj;

    return newItemBtn;
  }

  initSettingsBtn() {
    const newItemBtn = initButton(
      this.getCssClass("settingsBtn"),
      baseListDomComponent.showDialog,
      uiIcons.settings
    );
    newItemBtn.associatedDialog = this.constructor.settingsDialog;
    newItemBtn.parentObj = this;

    return newItemBtn;
  }

  /* Add / remove items */
  addDomItem(item) {
    const li = initLiAsChildInList(this.ul, this.getCssClass("li"));

    const itemDom = this.initItemDom(item);
    this.#listMap.set(itemDom.obj, itemDom.div);
    li.appendChild(itemDom.div);
    li.obj = itemDom.obj;

    this.sortBy();
    return li;
  }

  addMultipleDomItems(itemArray) {
    itemArray.forEach((item) => {
      this.addDomItem(item);
    });
  }

  removeItem(item) {
    /* item is a reference to a baseComponent object */
    const domItemDiv = this.#listMap.get(item);
    if (domItemDiv != null) {
      this.removeDomItemDiv(domItemDiv);
    }
  }

  removeDomItemDiv(domItemDiv) {
    /* item is a reference to a baseDomComponent.div object */
    deleteElement(domItemDiv.parentElement); // delete the li item too, which is the parent of the item
  }

  static toggleVisibility(e) {
    const nowHidden = e.currentTarget.ul.classList.toggle("hidden");

    changeChildFaIcon(
      e.currentTarget.btn,
      nowHidden ? uiIcons.show : uiIcons.hide
    );
    e.stopPropagation();
  }

  static showDialog(e) {
    const associatedDialog = e.currentTarget.associatedDialog();
    if (associatedDialog != null) {
      // reset form //tofix
      associatedDialog.setObjectData(e.currentTarget.parentObj);
      associatedDialog.dialog.showModal();
    }
    e.stopPropagation();
  }

  sortBy(variable = null, descending = false) {
    const sortedList =
      variable != null
        ? this.obj.getSortedBy(variable, descending)
        : this.obj.getSorted();

    if (sortedList.length > this.#listMap.size) {
      return;
    }
    //console.log(this.obj.type, variable, sortedList, this.#listMap);

    sortedList.forEach((itm, idx) => {
      const domItemDiv = this.#listMap.get(itm);
      if (domItemDiv != null && domItemDiv.parentElement != null) {
        domItemDiv.parentElement.style.order = idx;
      }
    });
  }

  updateSettings(data) {
    Object.assign(this.obj.settings, data);
    this.sortBy();
  }
}
