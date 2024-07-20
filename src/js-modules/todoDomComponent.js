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
};

// see the correspondence in todoComponent.stateLabels
const stateIcons = [
  { prefix: "regular", icon: "circle" }, //"todo"
  { prefix: "regular", icon: "circle-dot" }, //"wip"
  { prefix: "solid", icon: "circle-check" }, //"done"
];
// see the correspondence in todoComponent.priorityLabels
const priorityColors = [
  `rgb(173,168,182)`, //"none"
  `rgb(95,173,86)`, //"low"
  `rgb(246,174,45)`, //"medium"
  `rgb(215,38,61)`, //"high"
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
  "inherit", //"none"
  "inherit", //"scheduled"
  `rgb(60,145,230)`, //"upcoming"
  `rgb(60,145,230)`, //"today"
  `rgb(215,38,61)`, //"expired"
];

const genericIcons = {
  dueDate: { prefix: "solid", icon: "calendar-day" },
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

    if (this.obj.isExpired()) {
      dueDateInfoContent.style.color = imminenceColors[this.obj.imminenceIdx];
      dueDateInfoContent.textContent += ` (expired)`;
    }

    return dueDateInfoDiv;
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
