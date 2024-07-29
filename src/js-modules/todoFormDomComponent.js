import {
  initDiv,
  initLabel,
  initSelect,
  initOptionAsChildInList,
} from "../js-utilities/commonDomComponents.js";
import baseFormDomComponent from "./baseFormDomComponent.js";
import todoComponent from "./todoComponent.js";
import todoDomComponent from "./todoDomComponent.js";

export default class todoFormDomComponent extends baseFormDomComponent {
  static blockName = "todo-form-dialog";
  static type = "Todo";

  static defaultPrioritySelected = 0; // none

  static cssClass = {
    ...baseFormDomComponent.cssClass,
    otherInfosDiv: `other-infos-div`,
    otherInfoDiv: `other-info-div`,
    dueDateInfoDiv: `due-date-info-div`,
    priorityInfoDiv: `priority-info-div`,
  };

  constructor(obj) {
    super(obj);

    this.form.appendChild(this.initFormOtherInfo());
  }

  // Methods
  getOtherInfoClassesName(whichClass, classesLabel, idsLabel) {
    const baseClass = [
      this.getCssClass("otherInfoDiv"),
      this.getCssClass(whichClass),
    ];

    const listOfClasses = {};
    classesLabel.forEach((itm) => {
      listOfClasses[itm] = baseClass.map((cls) => `${cls}-${itm}`);
    });

    const listOfIds = {};
    idsLabel.forEach((itm) => {
      listOfIds[itm] = `${baseClass[1]}-${itm}`;
    });

    return [baseClass, listOfClasses, listOfIds];
  }

  initFormOtherInfo() {
    const div = initDiv(this.getCssClass("otherInfosDiv"));

    div.append(this.initFormDueDate());
    div.append(this.initFormPriority());

    return div;
  }

  // Due Date

  initFormDueDate() {
    const div = initDiv("todo-div");

    return div;
  }

  /* Priority input */

  initFormPriority() {
    const [divClass, listOfClasses, listOfIds] = this.getOtherInfoClassesName(
      "priorityInfoDiv",
      ["label", "select", "option"],
      ["select"]
    );

    const div = initDiv(divClass);

    const label = initLabel(
      listOfClasses.label,
      listOfIds.select, // for
      todoDomComponent.otherInfoIcons.priority,
      "",
      "Priority: "
    );

    const select = initSelect(
      listOfClasses.select,
      listOfIds.select, // id
      "priority"
    );

    todoComponent.priorityLabels.forEach((itm, idx) => {
      initOptionAsChildInList(select, listOfClasses.option, idx, itm);
    });

    // save reference to data
    this.prioritySelect = select;

    // init input
    this.resetPrioritySelect();

    div.append(label, select);

    return div;
  }

  setPrioritySelect(priority) {
    // priority: number
    this.prioritySelect.children[priority].selected = true;
  }

  resetPrioritySelect() {
    this.setPrioritySelect(this.constructor.defaultPrioritySelected);
  }
}
