import {
  initDiv,
  initButton,
  initP,
} from "../js-utilities/commonDomComponents.js";
import baseDomComponent from "./baseDomComponent.js";

const blockName = "todo-div";
const cssClass = {
  div: blockName,
  stateBtn: `${blockName}__state-btn`,
  imminenceIcon: `${blockName}__imminence-icon`,
  otherInfosDiv: `${blockName}__other-infos-div`,
  otherInfoDiv: `${blockName}__other-info-div`,
  dueDateInfoDiv: `${blockName}__due-date-info-div`,
  priorityInfoDiv: `${blockName}__priority-info-div`,
  stateInfoDiv: `${blockName}__state-info-div`,
};

const colors = {
  grey: `rgb(173,168,182)`,
  green: `rgb(95,173,86)`,
  yellow: `rgb(246,174,45)`,
  red: `rgb(215,38,61)`,
  blue: `rgb(60,145,230)`,
};

// see the correspondence in todoComponent.stateLabels
const stateIcons = [
  { prefix: "regular", icon: "circle" }, //"todo"
  { prefix: "regular", icon: "circle-dot" }, //"wip"
  { prefix: "solid", icon: "circle-check" }, //"done"
];
// see the correspondence in todoComponent.priorityLabels
const priorityColors = [
  colors.grey, //"none"
  colors.green, //"low"
  colors.yellow, //"medium"
  colors.red, //"high"
];
// see the correspondence in todoComponent.priorityLabels
const stateColors = [
  "inherit", //"todo"
  "inherit", //"wip"
  "inherit", //"done"
];
// see the correspondence in todoComponent.imminenceLabels
const imminenceIcons = [
  null, //"none"
  null, //"scheduled"
  { prefix: "solid", icon: "exclamation" }, //"upcoming"
  { prefix: "solid", icon: "circle-exclamation" }, //"today"
  { prefix: "solid", icon: "triangle-exclamation" }, //"expired"
];
// see the correspondence in todoComponent.imminenceLabels
const imminenceColors = [
  colors.grey, //"none"
  "inherit", //"scheduled"
  colors.blue, //"upcoming"
  colors.blue, //"today"
  colors.red, //"expired"
];

const genericIcons = {
  dueDate: { prefix: "solid", icon: "calendar-day" },
  priority: { prefix: "solid", icon: "flag" },
  state: { prefix: "solid", icon: "list-check" },
};

export default class projectDomComponent extends baseDomComponent {
  constructor(obj) {
    super(obj, blockName);
  }

  init() {
    this.div = initDiv(cssClass.div);

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
    const div = initDiv(cssClass.otherInfosDiv);

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
      cssClass.stateBtn,
      () => {} /* todo */,
      stateIcons[this.obj.stateIdx]
    );

    // Set the color
    iconBtn.style.color = priorityColors[this.obj.priorityIdx];

    return iconBtn;
  }

  initImminenceIcon() {
    // The icon shows the state of the todo, the color shows the priority

    // Init the button with the right icon
    const imminenceIcon = initP(
      cssClass.imminenceIcon,
      imminenceIcons[this.obj.imminenceIdx]
    );

    // Set the color
    imminenceIcon.style.color = imminenceColors[this.obj.imminenceIdx];

    return imminenceIcon;
  }

  initDueDate() {
    // Init the button with the right icon
    const [dueDateInfoDiv, , dueDateInfoContent] = this.initInfo(
      cssClass.dueDateInfoDiv,
      genericIcons.dueDate,
      `Due date: `,
      `${this.obj.dueDateFormattedRelative().split(/ at /)[0]}`
    );

    dueDateInfoContent.style.color = imminenceColors[this.obj.imminenceIdx];

    if (this.obj.isExpired()) {
      dueDateInfoContent.textContent += ` (expired)`;
    }

    return dueDateInfoDiv;
  }

  initPriority() {
    // Init the button with the right icon
    const [priorityInfoDiv, , priorityInfoContent] = this.initInfo(
      cssClass.priorityInfoDiv,
      genericIcons.priority,
      `Priority: `,
      `${this.obj.priority}`
    );

    priorityInfoContent.style.color = priorityColors[this.obj.priorityIdx];

    return priorityInfoDiv;
  }

  initState() {
    // Init the button with the right icon
    const [stateInfoDiv, , stateInfoContent] = this.initInfo(
      cssClass.stateInfoDiv,
      genericIcons.state,
      `State: `,
      `${this.obj.state}`
    );

    stateInfoContent.style.color = stateColors[this.obj.stateIdx];

    return stateInfoDiv;
  }

  initInfo(cssClassDiv, iconLabel, textLabel, textContent) {
    const div = initDiv([cssClass.otherInfoDiv, cssClassDiv]);

    const label = initP(
      [`${cssClass.otherInfoDiv}-label`, `${cssClassDiv}-label`],
      iconLabel,
      "",
      textLabel
    );

    const content = initP(
      [`${cssClass.otherInfoDiv}-content`, `${cssClassDiv}-content`],
      null,
      "",
      textContent
    );

    div.append(label);
    div.append(content);

    return [div, label, content];
  }
}
