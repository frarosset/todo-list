import {
  initUl,
  initLiAsChildInList,
  initDiv,
  initH3,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

export default class baseListDomComponent {
  static blockName = "base-list-div";
  static cssClass = {
    titleH3: `title-h3`,
    ul: `ul`,
    li: `li`,
  };

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

    this.div.appendChild(
      initH3(this.getCssClass("titleH3"), null, this.obj.name)
    );

    this.ul = initUl(this.getCssClass("ul"));
    this.div.appendChild(this.ul);

    this.addMultipleDomItems(this.obj.list);
  }

  addDomItem(item) {
    const li = initLiAsChildInList(this.ul, this.getCssClass("li"));

    li.associatedItem = item;
    const itemDom = this.initItemDom(item);
    li.appendChild(itemDom.div);

    li.addEventListener("click", this.constructor.btnRenderItemCallback);

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

  // callbacks
  static btnRenderItemCallback = () => {
    // dummy callback for the base component (to be redefined)
  };
}
