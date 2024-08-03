import baseDomComponent from "./baseDomComponent.js";
import { listInDomComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class noteDomComponent extends baseDomComponent {
  static blockName = "note-div";
  static associatedDialog = () => document.body.noteFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    super.init(dateFormatFcn);
    this.initAllDomLists(); // method added via composition (see below)
  }
}

// Add todoDomList, projectDomList, noteDomList (based on what is defined in this.obj.list)
// with composition (using mixin) with this method:
// - initAllDomLists -------------> must be called in the constructor
listInDomComponentMixin(noteDomComponent);
