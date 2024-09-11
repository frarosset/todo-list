import baseListDomComponent from "./baseListDomComponent.js";
import { noteDomMiniComponent } from "./fixCircularDependenciesInDomComponents.js";

export default class noteListDomComponent extends baseListDomComponent {
  static blockName = "note-list-div";
  static associatedDialog = () => document.body.noteFormDialog; // method to fetch the dialog after its creation

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  // Methods

  initItemDom(item) {
    return new noteDomMiniComponent(item, this.showPath);
  }
}
