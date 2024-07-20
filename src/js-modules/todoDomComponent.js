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

    this.main = this.initMain();
    this.div.appendChild(this.main);

    this.div.appendChild(this.initFooter());
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
      cssClass.stateBtn,
      imminenceIcons[this.obj.imminenceIdx]
    );

    // Set the color
    imminenceIcon.style.color = imminenceColors[this.obj.imminenceIdx];

    return imminenceIcon;
  }
}
