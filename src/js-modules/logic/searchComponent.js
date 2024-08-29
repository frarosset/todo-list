import genericBaseComponent from "./genericBaseComponent.js";
import resultsComponent from "../logic/resultsComponent.js";
import { uiIcons } from "../dom/uiIcons.js";

export default class searchComponent extends genericBaseComponent {
  static defaultData = {
    ...genericBaseComponent.defaultData,
    title: "Search", // redefine
    icon: uiIcons.search, // redefine
  };

  constructor(data, root, parent = null) {
    super(data, parent);

    this.root = root;
    this.type = "S";

    const resultsData = resultsComponent.getDefaultResultsData("", "");
    this.resultsObj = new resultsComponent(resultsData, this.root);
  }

  updateSearchResults(lookupStr) {
    this.resultsObj.value = lookupStr;
  }
}
