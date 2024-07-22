import {
  initDiv,
  initButton,
  initP,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

export default class todoDomComponent extends baseDomComponent {
  static blockName = "todo-div";
  static cssClass = {
    ...baseDomComponent.cssClass,
    stateBtn: `state-btn`,
    imminenceIcon: `imminence-icon`,
    otherInfosDiv: `other-infos-div`,
    otherInfoDiv: `other-info-div`,
    dueDateInfoDiv: `due-date-info-div`,
    priorityInfoDiv: `priority-info-div`,
    stateInfoDiv: `state-info-div`,
  };

  static colors = {
    grey: `rgb(173,168,182)`,
    green: `rgb(95,173,86)`,
    yellow: `rgb(246,174,45)`,
    red: `rgb(215,38,61)`,
    blue: `rgb(60,145,230)`,
  };

  // see the correspondence in todoComponent.stateLabels
  static stateIcons = [
    { prefix: "regular", icon: "circle" }, //"todo"
    { prefix: "regular", icon: "circle-dot" }, //"wip"
    { prefix: "solid", icon: "circle-check" }, //"done"
  ];
  // see the correspondence in todoComponent.priorityLabels
  static priorityColors = [
    todoDomComponent.colors.grey, //"none"
    todoDomComponent.colors.green, //"low"
    todoDomComponent.colors.yellow, //"medium"
    todoDomComponent.colors.red, //"high"
  ];

  // see the correspondence in todoComponent.priorityLabels
  static stateColors = [
    "inherit", //"todo"
    "inherit", //"wip"
    "inherit", //"done"
  ];

  // see the correspondence in todoComponent.imminenceLabels
  static imminenceIcons = [
    null, //"none"
    null, //"scheduled"
    { prefix: "solid", icon: "exclamation" }, //"upcoming"
    { prefix: "solid", icon: "circle-exclamation" }, //"today"
    { prefix: "solid", icon: "triangle-exclamation" }, //"expired"
  ];

  // see the correspondence in todoComponent.imminenceLabels
  static imminenceColors = [
    todoDomComponent.colors.grey, //"none"
    "inherit", //"scheduled"
    todoDomComponent.colors.blue, //"upcoming"
    todoDomComponent.colors.blue, //"today"
    todoDomComponent.colors.red, //"expired"
  ];

  static genericIcons = {
    dueDate: { prefix: "solid", icon: "calendar-day" },
    priority: { prefix: "solid", icon: "flag" },
    state: { prefix: "solid", icon: "list-check" },
  };

  constructor(obj) {
    super(obj);
  }

  init() {
    this.div = initDiv(this.constructor.blockName);

    this.header = this.initHeader();
    this.div.appendChild(this.header);
    this.header.prepend(this.initImminenceIcon());
    this.header.prepend(this.initStatusBtn());
    this.header.append(this.initOtherInfo());

    this.main = this.initMain();
    this.div.appendChild(this.main);

    this.div.appendChild(this.initFooter());
  }

  // Block initialization
  initOtherInfo() {
    const div = initDiv(this.getCssClass("otherInfosDiv"));

    div.append(this.initDueDate());
    div.append(this.initPriority());
    div.append(this.initState());

    return div;
  }

  // Components initialization

  initStatusBtn() {
    /* TODO: test + add buttons with callbacks */
    // The icon shows the state of the todo, the color shows the priority

    // Init the button with the right icon
    const iconBtn = initButton(
      this.getCssClass("stateBtn"),
      () => {} /* todo */,
      todoDomComponent.stateIcons[this.obj.stateIdx]
    );

    // Set the color
    iconBtn.style.color = todoDomComponent.priorityColors[this.obj.priorityIdx];

    // Set the tooltip when hovering
    iconBtn.title = `${this.obj.state} (priority: ${this.obj.priority})`;

    return iconBtn;
  }

  initImminenceIcon() {
    // The icon shows the state of the todo, the color shows the priority

    // Init the button with the right icon
    const imminenceIcon = initP(
      this.getCssClass("imminenceIcon"),
      todoDomComponent.imminenceIcons[this.obj.imminenceIdx]
    );

    // Set the color
    imminenceIcon.style.color =
      todoDomComponent.imminenceColors[this.obj.imminenceIdx];

    // Set the tooltip when hovering
    if (todoDomComponent.imminenceIcons[this.obj.imminenceIdx] != null) {
      imminenceIcon.title = `${this.obj.imminence}`;
    }

    return imminenceIcon;
  }

  initDueDate(label = `Due date: `) {
    // Init the button with the right icon
    const [dueDateInfoDiv, , dueDateInfoContent] = this.initInfo(
      this.getCssClass("dueDateInfoDiv"),
      todoDomComponent.genericIcons.dueDate,
      label,
      `${this.obj.dueDateFormattedRelative().split(/ at /)[0]}`
    );

    dueDateInfoContent.style.color =
      todoDomComponent.imminenceColors[this.obj.imminenceIdx];

    if (this.obj.isExpired()) {
      dueDateInfoContent.textContent += ` (expired)`;
    }

    return dueDateInfoDiv;
  }

  initPriority(label = `Priority: `) {
    // Init the button with the right icon
    const [priorityInfoDiv, , priorityInfoContent] = this.initInfo(
      this.getCssClass("priorityInfoDiv"),
      todoDomComponent.genericIcons.priority,
      label,
      `${this.obj.priority}`
    );

    priorityInfoContent.style.color =
      todoDomComponent.priorityColors[this.obj.priorityIdx];

    return priorityInfoDiv;
  }

  initState(label = `State: `) {
    // Init the button with the right icon
    const [stateInfoDiv, , stateInfoContent] = this.initInfo(
      this.getCssClass("stateInfoDiv"),
      todoDomComponent.genericIcons.state,
      label,
      `${this.obj.state}`
    );

    stateInfoContent.style.color =
      todoDomComponent.stateColors[this.obj.stateIdx];

    return stateInfoDiv;
  }

  initInfo(cssClassDiv, iconLabel, textLabel, textContent) {
    const div = initDiv([this.getCssClass("otherInfoDiv"), cssClassDiv]);

    const label = initP(
      [`${this.getCssClass("otherInfoDiv")}-label`, `${cssClassDiv}-label`],
      iconLabel,
      "",
      textLabel
    );

    const content = initP(
      [`${this.getCssClass("otherInfoDiv")}-content`, `${cssClassDiv}-content`],
      null,
      "",
      textContent
    );

    div.append(label);
    div.append(content);

    return [div, label, content];
  }
}
