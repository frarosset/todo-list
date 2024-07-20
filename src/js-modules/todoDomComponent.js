import { initDiv, initButton } from "../js-utilities/commonDomComponents.js";
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
const priorityColor = [
  `rgb(173,168,182)`, //"none"
  `rgb(95,173,86)`, //"low"
  `rgb(246,174,45)`, //"medium"
  `rgb(215,38,61)`, //"high"
];

export default class projectDomComponent extends baseDomComponent {
  constructor(obj) {
    super(obj, blockName);
  }

  init() {
    this.div = initDiv(cssClass.div);

    this.header = this.initHeader();
    this.div.appendChild(this.header);
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
    iconBtn.style.color = priorityColor[this.obj.priorityIdx];

    return iconBtn;
  }
}
