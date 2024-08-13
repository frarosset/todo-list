import {
  initDiv,
  initButton,
  initP,
} from "../../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";
import { changeChildFaIcon } from "../../js-utilities/fontAwesomeUtilities.js";
import PubSub from "pubsub-js";
import { listInDomComponentMixin } from "./fixCircularDependenciesInDomComponents.js";

export default class todoDomComponent extends baseDomComponent {
  static blockName = "todo-div";
  static cssClass = {
    ...baseDomComponent.cssClass,
    stateBtn: `state-btn`,
    imminenceIcon: `imminence-icon`,
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
    { prefix: "solid", icon: "blank" }, //"none"
    { prefix: "solid", icon: "blank" }, //"scheduled"
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
    state: { prefix: "solid", icon: "circle-half-stroke" },
  };

  static associatedDialog = () => document.body.todoFormDialog; // method to fetch the dialog after its creation

  constructor(obj) {
    super(obj);
  }

  init(dateFormatFcn = baseDomComponent.dateFormatFcn) {
    super.init(dateFormatFcn);

    this.header.prepend(this.initImminenceIcon());
    this.header.prepend(this.initStatusBtn());

    this.initAllDomLists(); // method added via composition (see below)
  }

  // Block initialization
  initOtherInfo(showNTodoNestedIcon = true, showTodoInfo = true) {
    const div = super.initOtherInfo(showNTodoNestedIcon);

    if (showTodoInfo) {
      div.append(this.initDueDate());
      div.append(this.initPriority());
      div.append(this.initState());
    }

    return div;
  }

  // Components initialization

  initStatusBtn() {
    // The icon shows the state of the todo, the color shows the priority
    const getTitleString = () =>
      `${this.obj.state} (priority: ${this.obj.priority})`;
    const getIcon = () => todoDomComponent.stateIcons[this.obj.stateIdx];
    const getColor = () =>
      todoDomComponent.priorityColors[this.obj.priorityIdx];

    // Init the button with the right icon
    const statusBtn = initButton(
      this.getCssClass("stateBtn"),
      this.constructor.statusBtnCallback,
      getIcon()
    );

    statusBtn.todo = this.obj; // for callback

    // Set the color
    statusBtn.style.color = getColor();

    // Set the tooltip when hovering
    statusBtn.title = getTitleString();

    // Subscribe to the change of the state of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("STATE CHANGE", "main"), (msg) => {
      console.log(msg);
      changeChildFaIcon(statusBtn, getIcon());
      statusBtn.title = getTitleString();
    });

    // Subscribe to the change of the priority of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("PRIORITY CHANGE", "main"), (msg) => {
      console.log(msg);
      statusBtn.style.color = getColor();
      statusBtn.title = getTitleString();
    });

    return statusBtn;
  }

  // Extend the initTitle method in the todo class, to show custom style
  initTitle() {
    const h2 = super.initTitle();

    const getTitleH2TextDecorationByState = () =>
      todoDomComponent.titleH2TextDecorationByState[this.obj.stateIdx];

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
    const getIcon = () =>
      todoDomComponent.imminenceIcons[this.obj.imminenceIdx];
    const getColor = () =>
      todoDomComponent.imminenceColors[this.obj.imminenceIdx];

    // Init the icon with the right icon
    const imminenceIcon = initP(this.getCssClass("imminenceIcon"), getIcon());

    // Set the color
    imminenceIcon.style.color = getColor();

    // Set the tooltip when hovering
    imminenceIcon.title = `${this.obj.imminence}`;

    PubSub.subscribe(this.getPubSubName("IMMINENCE CHANGE", "main"), (msg) => {
      console.log(msg);

      changeChildFaIcon(imminenceIcon, getIcon());
      imminenceIcon.style.color = getColor();
      imminenceIcon.title = `${this.obj.imminence}`;
    });

    return imminenceIcon;
  }

  initDueDate(label = `Due date: `) {
    const cssClass = this.getCssClass("dueDateInfoDiv");
    const cssClassNone = `${cssClass}__none`;

    const getDate = () =>
      `${this.obj.dueDateFormattedRelative().split(/ at /)[0]}`;
    const getColor = () =>
      todoDomComponent.imminenceColors[this.obj.imminenceIdx];

    const setContent = (dueDateInfoDiv, contentDom) => {
      contentDom.textContent = getDate();

      if (this.obj.isExpired()) {
        contentDom.style.color = getColor();
        contentDom.textContent += ` (expired)`;
      } else if (this.obj.hasNotDueDate()) {
        contentDom.style.color = todoDomComponent.colors.grey;
      } else {
        contentDom.style.color = "inherit";
      }

      dueDateInfoDiv.classList.toggle(cssClassNone, this.obj.hasNotDueDate());
    };

    // Init the button with the right icon
    const [dueDateInfoDiv, , dueDateInfoContent] = this.initInfo(
      cssClass,
      todoDomComponent.otherInfoIcons.dueDate,
      label,
      getDate()
    );

    setContent(dueDateInfoDiv, dueDateInfoContent);

    PubSub.subscribe(this.getPubSubName("IMMINENCE CHANGE", "main"), (msg) => {
      console.log(msg);
      setContent(dueDateInfoDiv, dueDateInfoContent);
    });

    PubSub.subscribe(this.getPubSubName("DUEDATE CHANGE", "main"), (msg) => {
      console.log(msg);
      setContent(dueDateInfoDiv, dueDateInfoContent);
    });

    return dueDateInfoDiv;
  }

  initPriority(label = `Priority: `) {
    const getString = () => `${this.obj.priority}`;
    const getColor = () =>
      todoDomComponent.priorityColors[this.obj.priorityIdx];

    // Init the button with the right icon
    const [priorityInfoDiv, , priorityInfoContent] = this.initInfo(
      this.getCssClass("priorityInfoDiv"),
      todoDomComponent.otherInfoIcons.priority,
      label,
      getString()
    );

    priorityInfoContent.style.color = getColor();

    // Subscribe to the change of the priority of a todo component, to update the interface
    PubSub.subscribe(this.getPubSubName("PRIORITY CHANGE", "main"), (msg) => {
      console.log(msg);
      priorityInfoContent.textContent = getString();
      priorityInfoContent.style.color = getColor();
    });

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
    const divClasses = [this.getCssClass("otherInfoDiv"), cssClassDiv];
    const labelClasses = divClasses.map((cls) => `${cls}-label`);
    const selectClasses = divClasses.map((cls) => `${cls}-content`);

    const div = initDiv(divClasses);
    const label = initP(labelClasses, iconLabel, "", textLabel);
    const content = initP(selectClasses, null, "", textContent);

    div.append(label);
    div.append(content);

    return [div, label, content];
  }
}

// Add todoDomList, projectDomList, noteDomList (based on what is defined in this.obj.list)
// with composition (using mixin) with this method:
// - initAllDomLists -------------> must be called in the constructor
listInDomComponentMixin(todoDomComponent);
