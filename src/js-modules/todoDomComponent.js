import {
  initDiv,
  initButton,
  initP,
  initH2,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";
import { changeChildFaIcon } from "../js-utilities/fontAwesomeUtilities.js";
import PubSub from "pubsub-js";

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
  static titleH2TextDecorationByState = [
    "none", //"todo"
    "none", //"wip"
    "line-through", //"done"
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

  static otherInfoIcons = {
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

    this.content = this.initContent();
    this.div.appendChild(this.content);

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
    // The icon shows the state of the todo, the color shows the priority
    const getTitleString = () =>
      `${this.obj.state} (priority: ${this.obj.priority})`;
    const getIcon = () => todoDomComponent.stateIcons[this.obj.stateIdx];

    // Init the button with the right icon
    const statusBtn = initButton(
      this.getCssClass("stateBtn"),
      this.constructor.statusBtnCallback,
      getIcon()
    );

    statusBtn.todo = this.obj; // for callback

    // Set the color
    statusBtn.style.color =
      todoDomComponent.priorityColors[this.obj.priorityIdx];

    // Set the tooltip when hovering
    statusBtn.title = getTitleString();

    // Subscribe to the change of the state change of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("STATE CHANGE", "main"), (msg) => {
      console.log(msg);
      changeChildFaIcon(statusBtn, getIcon());
      statusBtn.title = getTitleString();
    });

    return statusBtn;
  }

  // Overwrite the following method in the todo class, to show custom style
  initTitle() {
    const getTitleH2TextDecorationByState = () =>
      todoDomComponent.titleH2TextDecorationByState[this.obj.stateIdx];

    const h2 = initH2(this.getCssClass("titleH2"), null, this.obj.title);

    // Set the tooltip when hovering
    h2.style.textDecorationLine = getTitleH2TextDecorationByState();

    // Subscribe to the change of the state change of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("STATE CHANGE", "main"), (msg) => {
      console.log(msg);
      h2.style.textDecorationLine = getTitleH2TextDecorationByState();
    });

    return h2;
  }

  // callbacks
  static statusBtnCallback = (e) => {
    e.currentTarget.todo.toggleState();
    // The update of the interface is handled through PubSub pattern
    e.stopPropagation();
  };

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
      todoDomComponent.otherInfoIcons.dueDate,
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
      todoDomComponent.otherInfoIcons.priority,
      label,
      `${this.obj.priority}`
    );

    priorityInfoContent.style.color =
      todoDomComponent.priorityColors[this.obj.priorityIdx];

    return priorityInfoDiv;
  }

  initState(label = `State: `) {
    const getString = () => `${this.obj.state}`;
    const getColor = () => todoDomComponent.stateColors[this.obj.stateIdx];

    // Init the button with the right icon
    const [stateInfoDiv, , stateInfoContent] = this.initInfo(
      this.getCssClass("stateInfoDiv"),
      todoDomComponent.otherInfoIcons.state,
      label,
      getString()
    );

    stateInfoContent.style.color = getColor();

    // Subscribe to the change of the state change of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("STATE CHANGE", "main"), (msg) => {
      console.log(msg);
      stateInfoContent.textContent = getString();
      stateInfoContent.style.color = getColor();
    });

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
