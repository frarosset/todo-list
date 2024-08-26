import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
  initH3,
} from "../../js-utilities/commonDomComponents.js";
import genericBaseDomComponent from "./genericBaseDomComponent.js";
import PubSub from "pubsub-js";
import resultsComponent from "../logic/resultsComponent.js";

export default class filtersAndTagsDomComponent extends genericBaseDomComponent {
  static blockName = "filters-and-tags-div";

  static cssClass = {
    ...genericBaseDomComponent.cssClass,
    todoFiltersDiv: `todo-filters-div`,
    todoFilterDiv: `todo-filter-div`,
    todoFilterH3: `todo-filter-h3`,
    todoFilterUl: `todo-filter-ul`,
    todoFilterLi: `todo-filter-li`,
    todoFilterBtn: `todo-filter-btn`,
    tagFiltersDiv: `tag-filters-div`,
    tagFilterDiv: `tag-filter-div`,
    tagFilterH3: `tag-filter-h3`,
    agFilterUl: `tag-filter-ul`,
    tagFilterLi: `tag-filter-li`,
    tagFilterBtn: `tag-filter-btn`,
  };

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  initContent() {
    const contentDiv = super.initContent();

    contentDiv.append(this.initTodoFilters());
    contentDiv.append(this.initTagFilters());

    return contentDiv;
  }

  initFiltersFromData(data, type) {
    const filterDiv = initDiv(this.getCssClass(`${type}FilterDiv`));

    const h3 = initH3(
      this.getCssClass(`${type}FilterH3`),
      data.icon,
      "",
      data.variable
    );

    const valuesUl = initUl(this.getCssClass(`${type}FilterUl`));

    data.values.forEach((value, idx) => {
      const label = data.labels != null ? data.labels[idx] : value;

      const valueLi = initLiAsChildInList(
        valuesUl,
        this.getCssClass(`${type}FilterLi`)
      );
      const valueBtn = initButton(
        this.getCssClass(`${type}FilterBtn`),
        this.constructor.resultsBtnCallback,
        null,
        label
      );
      valueBtn.filterVariable = data.variable;
      valueBtn.filterValue = value;
      valueBtn.filterLabel = label;
      valueBtn.filterParent = this.obj;

      valueLi.appendChild(valueBtn);
    });

    filterDiv.append(h3, valuesUl);

    return filterDiv;
  }

  initTodoFilters() {
    const div = initDiv(this.getCssClass("todoFiltersDiv"));

    this.obj.todoFiltersData.forEach((data) => {
      div.append(this.initFiltersFromData(data, "todo"));
    });

    return div;
  }

  initTagFilters() {
    const div = initDiv(this.getCssClass("tagFiltersDiv"));

    const data = this.obj.tagFiltersData;
    div.append(this.initFiltersFromData(data, "tag"));

    return div;
  }

  static resultsBtnCallback = (e) => {
    const variable = e.currentTarget.filterVariable;
    const value = e.currentTarget.filterValue;
    const label = e.currentTarget.filterLabel;
    const parent = e.currentTarget.filterParent;

    const resultsData = resultsComponent.getDefaultResultsData(
      variable,
      value,
      label
    );

    // refresh the whole view, to show the results of filtering by this tag
    PubSub.publish("RENDER RESULTS", { data: resultsData, parent: parent });

    e.stopPropagation();
  };
}
