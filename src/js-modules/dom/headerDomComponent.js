import {
  initH1,
  initButton,
  initDiv,
} from "../../js-utilities/commonDomComponents.js";
import navDomComponent from "./navDomComponent.js";
import { uiIcons } from "../uiIcons.js";
import { changeChildFaIcon } from "../../js-utilities/fontAwesomeUtilities.js";

export default class headerDomComponent {
  constructor(root) {
    this.header = document.createElement("header");

    const headingDiv = initDiv("app-heading");
    const h1 = initH1("app-title", null, "", "TODO APP");
    const navObj = new navDomComponent(root);
    const expandBtn = initExpandNavBtn(navObj.nav);

    headingDiv.append(expandBtn, h1);
    this.header.append(headingDiv, navObj.nav);
  }
}

function initExpandNavBtn(nav) {
  const expandBtn = initButton(
    "app-expand-btn",
    toggleVisibility,
    uiIcons.navShow
  );
  expandBtn.nav = nav;
  nav.classList.toggle("hidden", true);
  expandBtn.btn = expandBtn;

  return expandBtn;
}

function toggleVisibility(e) {
  const nowHidden = e.currentTarget.nav.classList.toggle("hidden");

  changeChildFaIcon(
    e.currentTarget.btn,
    nowHidden ? uiIcons.navShow : uiIcons.navHide
  );
  e.stopPropagation();
}
