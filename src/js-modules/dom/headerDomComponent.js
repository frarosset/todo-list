import navDomComponent from "./navDomComponent.js";

export default class headerDomComponent {
  constructor(root) {
    this.header = document.createElement("header");

    const h1 = document.createElement("h1");
    h1.textContent = "TODO APP";

    const navObj = new navDomComponent(root);

    this.header.appendChild(h1);
    this.header.appendChild(navObj.nav);
  }
}
