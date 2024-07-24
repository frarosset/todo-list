import {
  initUl,
  initLiAsChildInList,
  initButton,
  initDiv,
} from "../js-utilities/commonDomComponents.js";

const blockName = "main-nav";
const cssClass = {
  nav: blockName,
  divPredefined: `${blockName}__div-predefined`,
  ulPredefined: `${blockName}__ul-predefined`,
  liInbox: `${blockName}__li-inbox`,
  btnInbox: `${blockName}__btn-inbox`,
  divProjects: `${blockName}__div-custom-projects`,
  ulProjects: `${blockName}__ul-custom-projects`,
  liProjects: `${blockName}__li-custom-project`,
  btnProjects: `${blockName}__btn-custom-project`,
};

export default class navDomComponent {
  constructor(root) {
    this.nav = document.createElement("nav");
    this.nav.classList.add(cssClass.nav);

    const predefinedDiv = this.#initPredefinedDiv(root);
    const projectsDiv = this.#initProjectsDiv(root);

    this.nav.append(predefinedDiv, projectsDiv);
  }

  // helper methods
  #initPredefinedDiv(root) {
    const div = initDiv(cssClass.divPredefined);

    const ul = initUl(cssClass.ulPredefined);

    div.append(ul);

    // Init inbox project button
    this.#initProjectRenderLi(
      ul,
      root.inboxProject,
      cssClass.liInbox,
      cssClass.btnInbox,
      null
    );

    return div;
  }

  #initProjectsDiv(root) {
    const div = initDiv(cssClass.divProjects);

    const h2 = document.createElement("h2");
    h2.textContent = "PROJECTS";
    const ul = initUl(cssClass.ulProjects);

    div.append(h2, ul);

    // Init custom projects buttons

    root.customProjects.forEach((project) => {
      this.#initProjectRenderLi(
        ul,
        project,
        cssClass.liProjects,
        cssClass.btnProjects,
        null
      );
    });

    return div;
  }

  #initProjectRenderLi(ul, associatedProject, liClass, btnClass, btnIcon) {
    const li = initLiAsChildInList(ul, liClass);
    const btn = initButton(
      btnClass,
      navDomComponent.btnRenderProjectCallback,
      btnIcon,
      associatedProject.title
    );
    btn.associatedProject = associatedProject;
    li.appendChild(btn);
  }

  // callbacks
  static btnRenderProjectCallback = (e) => {
    document.body.mainDomObj.renderProject(e.target.associatedProject);
    e.stopPropagation();
  };
}
