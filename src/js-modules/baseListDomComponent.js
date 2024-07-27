import {
  initUl,
  initLiAsChildInList,
  initDiv,
  initH3,
  initButton,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";
import { changeChildFaIcon } from "../js-utilities/fontAwesomeUtilities.js";
import { uiIcons } from "./uiIcons.js";

export default class baseListDomComponent {
  static blockName = "base-list-div";
  static cssClass = {
    titleH3: `title-h3`,
    header: "header",
    ul: `ul`,
    li: `li`,
    newItemBtn: "new-item-btn",
    expandBtn: "expand-btn",
  };

  static associatedDialog = () => null; // method to fetch the dialog after its creation

  getCssClass(element) {
    return `${this.constructor.blockName}__${this.constructor.cssClass[element]}`;
  }

  constructor(objList) {
    this.obj = objList;
    this.init();
  }

  // Methods

  initItemDom(item) {
    return new baseDomComponent(item);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.ul = this.initUl();

    this.div.appendChild(this.initHeader(this.ul));
    this.div.appendChild(this.ul);

    this.addMultipleDomItems(this.obj.list);
  }

  /* Blocks */

  initHeader(ul) {
    const header = document.createElement("header");
    header.classList.add(this.getCssClass("header"));

    header.appendChild(this.initName());
    header.appendChild(this.initNewItemBtn());
    header.appendChild(this.initExpandBtn(ul));

    return header;
  }

  initUl() {
    const ul = initUl(this.getCssClass("ul"));
    return ul;
  }

  /* Components */

  initName() {
    return initH3(this.getCssClass("titleH3"), null, this.obj.name);
  }

  initExpandBtn(ul) {
    const expandBtn = initButton(
      this.getCssClass("expandBtn"),
      baseListDomComponent.toggleVisibility,
      uiIcons.hide
    );
    expandBtn.ul = ul;

    return expandBtn;
  }

  initNewItemBtn() {
    const newItemBtn = initButton(
      this.getCssClass("newItemBtn"),
      baseListDomComponent.addNewItem,
      uiIcons.new
    );
    newItemBtn.associatedDialog = this.constructor.associatedDialog;
    newItemBtn.parentObj = this.obj;

    return newItemBtn;
  }

  /* Add / remove items */

  addDomItem(item) {
    const li = initLiAsChildInList(this.ul, this.getCssClass("li"));

    const itemDom = this.initItemDom(item);
    li.appendChild(itemDom.div);

    return li;
  }

  addMultipleDomItems(itemArray) {
    itemArray.forEach((item) => {
      this.addDomItem(item);
    });
  }

  removeDomItem() {
    // TODO
    /* item is a reference to a baseDomComponent object */
    // const idx = this.obj.list.indexOf(item);
    // if (idx >= 0) {
    //   this.obj.list.splice(idx, 1);
    //   this.obj.updateParentDateOfEdit();
    // }
  }

  static toggleVisibility(e) {
    const nowHidden = e.currentTarget.ul.classList.toggle("hidden");

    changeChildFaIcon(e.currentTarget, nowHidden ? uiIcons.show : uiIcons.hide);
  }

  static addNewItem(e) {
    const associatedDialog = e.currentTarget.associatedDialog();
    if (associatedDialog != null) {
      // reset form //tofix
      associatedDialog.setObjectData(e.currentTarget.parentObj);
      associatedDialog.dialog.showModal();
    }
  }
}
