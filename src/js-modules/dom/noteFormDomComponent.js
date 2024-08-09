import baseFormDomComponent from "./baseFormDomComponent.js";

export default class noteFormDomComponent extends baseFormDomComponent {
  static blockName = "note-form-dialog";
  static type = "Note";

  constructor(root) {
    super(root);
  }
}
