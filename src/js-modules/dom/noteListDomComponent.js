import baseListDomComponent from "./baseListDomComponent.js";
import { noteDomMiniComponent } from "./fixCircularDependenciesInDomComponents.js";
import { uiIcons } from "./uiIcons.js";

export default class noteListDomComponent extends baseListDomComponent {
  static blockName = "note-list-div";
  static associatedDialog = () => document.body.noteFormDialog; // method to fetch the dialog after its creation
  static icon = uiIcons.noteList;

  constructor(obj) {
    super(obj);
  }

  // Methods

  initItemDom(item) {
    return new noteDomMiniComponent(item);
  }
}
