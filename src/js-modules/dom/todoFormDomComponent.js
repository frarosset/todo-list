import {
  initDiv,
  initLabel,
  initSelect,
  initDatalist,
  initInput,
  initOptionAsChildInList,
} from "../../js-utilities/commonDomComponents.js";
import baseFormDomComponent from "./baseFormDomComponent.js";
import { todoComponent } from "../logic/fixCircularDependenciesInComponents.js";
import { todoDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { format, addDays, addMonths, addYears } from "date-fns";

export default class todoFormDomComponent extends baseFormDomComponent {
  static blockName = "todo-form-dialog";
  static type = "Todo";

  static defaultPrioritySelected = 0; // none
  static dateFormat = "yyyy-MM-dd";

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

  setObjectData(obj, edit = false) {
    super.setObjectData(obj, edit);
    if (edit) {
      this.dueDateInput.min = format(
        obj.dateOfCreation,
        this.constructor.dateFormat
      );
    } else {
      this.dueDateInput.min = format(new Date(), this.constructor.dateFormat);
    }
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

  resetForm() {
    super.resetForm();

    // reset the due date input
    this.resetDueDateOnSelect();

    // reset the priority input
    this.resetPrioritySelect();
  }

  setDataToEdit(obj) {
    super.setDataToEdit(obj);
    this.setDueDateValue(obj.dueDate);
    this.setPrioritySelect(obj.priorityIdx);
  }

  getDataToSubmit() {
    const data = super.getDataToSubmit();
    data.dueDate = this.getDueDateValue();
    data.priority = this.prioritySelect.value;
    return data;
  }

  // Due Date

  getSampleDates() {
    const today = new Date();
    const sampleDates = [
      ["today", today],
      ["tomorrow", addDays(today, 1)],
      ["next week", addDays(today, 7)],
      ["next month", addMonths(today, 1)],
      ["next year", addYears(today, 1)],
    ];

    const sampleDatesFormatted = sampleDates.map((itm) => [
      itm[0],
      format(itm[1], this.constructor.dateFormat),
    ]);

    return sampleDatesFormatted;
  }

  initFormDueDate() {
    const [divClass, listOfClasses, listOfIds] = this.getOtherInfoClassesName(
      "dueDateInfoDiv",
      ["label", "select", "input", "datalist", "option"],
      ["input", "select", "datalist"]
    );

    const div = initDiv(divClass);

    // Compute the samples data
    const label = initLabel(
      listOfClasses.label,
      listOfIds.select, //for
      todoDomComponent.otherInfoIcons.dueDate,
      "",
      "Due date: "
    );

    // Add a select input, to select between 'none' and 'select date'
    const select = initSelect(
      listOfClasses.select,
      listOfIds.select,
      "priority"
    );

    ["none", "select date"].forEach((itm, idx) => {
      initOptionAsChildInList(select, listOfClasses.option, idx, itm);
    });

    // Add an input with type='date'
    const input = initInput(listOfClasses.input, listOfIds.input, "dueDate");
    input.type = "date";
    input.setAttribute("list", listOfIds.datalist);
    input.min = format(new Date(), this.constructor.dateFormat);

    const datalist = initDatalist(listOfClasses.datalist, listOfIds.datalist);
    const sampleDates = this.getSampleDates();
    sampleDates.forEach((itm) => {
      initOptionAsChildInList(datalist, listOfClasses.option, itm[1], itm[0]);
    });

    // save reference to data
    this.dueDateSelect = select;
    this.dueDateInput = input;
    this.dueDateLabel = label;

    // init input / select
    this.resetDueDateOnSelect();

    /* Add Event listeners to toggle between input and select based on values */

    const dueDateInputChangeCallback = () => {
      if (!input.value) {
        this.resetDueDateOnSelect();
      }
    };
    const dueDateSelectChangeCallback = () => {
      if (select.value) {
        this.resetDueDateOnInput();
      }
    };

    select.addEventListener("change", dueDateSelectChangeCallback);
    input.addEventListener("change", dueDateInputChangeCallback);

    /* Add everything to the div */

    div.append(label, select, input, datalist);

    return div;
  }

  resetDueDateOnInput(dueDate = new Date()) {
    this.dueDateInput.style.display = "initial";
    this.dueDateInput.value = format(dueDate, this.constructor.dateFormat);
    this.dueDateSelect.style.display = "none";
    this.dueDateLabel.setAttribute("for", this.dueDateInput.id);
  }

  resetDueDateOnSelect() {
    this.dueDateInput.style.display = "none";
    this.dueDateInput.value = "";
    this.dueDateSelect.style.display = "initial";
    this.dueDateSelect.value = 0;
    this.dueDateLabel.setAttribute("for", this.dueDateSelect.id);
  }

  getDueDateValue() {
    if (!this.dueDateSelect.value || !this.dueDateInput.value) {
      return null;
    } else {
      return new Date(this.dueDateInput.value);
    }
  }

  setDueDateValue(dueDate) {
    if (dueDate == null) {
      this.resetDueDateOnSelect();
    } else {
      this.resetDueDateOnInput(dueDate);
    }
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
