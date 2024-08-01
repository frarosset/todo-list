import baseDomComponent from "./baseDomComponent.js";

export default class noteDomComponent extends baseDomComponent {
  static blockName = "note-div";
  static associatedDialog = () => document.body.noteFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }
}
