import { initDiv, initInput } from "../../js-utilities/commonDomComponents.js";
import genericBaseDomComponent from "./genericBaseDomComponent.js";
import resultsDomComponent from "./resultsDomComponent.js";

export default class searchDomComponent extends genericBaseDomComponent {
  static blockName = "search-div";

  static cssClass = {
    ...genericBaseDomComponent.cssClass,
    lookupDiv: `lookup-div`,
    lookupInput: `lookup-input`,
    lookupLabel: `lookup-label`,
  };

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  initContent() {
    const contentDiv = super.initContent();

    contentDiv.append(this.initLookupInput());
    contentDiv.append(this.initLookupResults());

    return contentDiv;
  }

  initLookupInput() {
    const div = initDiv(this.getCssClass("lookupDiv"));

    const inputStr = this.getCssClass("lookupInput");
    const descriptionStr = "Search within title, description, and tags";
    const inputDiv = initInput(
      inputStr,
      inputStr,
      "lookupString",
      descriptionStr,
      false,
      descriptionStr
    );
    inputDiv.type = "search";
    inputDiv.maxLength = 500;

    inputDiv.obj = this.obj;

    div.append(inputDiv);

    inputDiv.addEventListener("input", searchDomComponent.lookupInputCallback);

    return div;
  }

  initLookupResults() {
    this.resultsObjDom = new resultsDomComponent(this.obj.resultsObj);
    return this.resultsObjDom.div;
  }

  static lookupInputCallback = (e) => {
    const value = e.currentTarget.value;
    const obj = e.currentTarget.obj;

    obj.updateSearchResults(value);
  };
}
