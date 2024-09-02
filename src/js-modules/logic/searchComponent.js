import genericBaseComponent from "./genericBaseComponent.js";
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
  }
}
