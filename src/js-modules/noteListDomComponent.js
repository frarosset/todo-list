import baseListDomComponent from "./baseListDomComponent.js";
import noteDomMiniComponent from "./noteDomMiniComponent.js";

export default class noteListDomComponent extends baseListDomComponent {
  static blockName = "note-list-div";
  static associatedDialog = () => document.body.noteFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new noteDomMiniComponent(item);
  }
}
