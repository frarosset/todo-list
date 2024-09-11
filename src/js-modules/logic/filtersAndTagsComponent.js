import genericBaseComponent from "./genericBaseComponent.js";
import todoComponent from "./todoComponent.js";
import { uiIcons } from "../uiIcons.js";

export default class filtersAndTagsComponent extends genericBaseComponent {
  #todoFiltersData;
  #tagFiltersData;

  static defaultData = {
    ...genericBaseComponent.defaultData,
    title: "Filters and tags", // redefine
    icon: uiIcons.filter, // redefine
  };

  constructor(data, root, parent = null) {
    super(data, parent);

    this.root = root;
    this.#todoFiltersData = this.initTodoFiltersData();
    this.#tagFiltersData = this.initTagFiltersData();

    this.type = "F";
  }

  static todoFiltersVariables = ["imminence", "state", "priority"];

  initTodoFiltersData() {
    const filters = [];
    this.constructor.todoFiltersVariables.forEach((variable) => {
      const filter = {};
      filter.icon = uiIcons[variable];
      filter.variable = variable;
      filter.labels = todoComponent[`${variable}Labels`];
      filter.values = filter.labels.map((_, idx) => idx);
      filters.push(filter);
    });

    return filters;
  }

  initTagFiltersData() {
    const filter = {};
    filter.icon = uiIcons.tag;
    filter.variable = "tag";

    return filter;
  }

  get todoFiltersData() {
    return this.#todoFiltersData;
  }

  get tagFiltersData() {
    return {
      ...this.#tagFiltersData,
      values: [...this.root.getAllTagsNested()],
    };
  }
}
