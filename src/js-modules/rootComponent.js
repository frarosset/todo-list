import projectComponent from "./projectComponent";

export default class rootComponent {
  #inboxProject;
  #customProjects;

  static dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

  constructor() {
    // Generic project
    this.#inboxProject = new projectComponent({ title: "Inbox" });

    // Custom projects list
    this.#customProjects = [];
  }

  // Getter methods
  get inboxProject() {
    return this.#inboxProject;
  }

  get customProjects() {
    return this.#customProjects;
  }

  // Add / remove custom project

  addProject(data) {
    const project = new projectComponent(data, null);
    this.customProjects.push(project);
    return project;
  }

  removeProject(project) {
    const idx = this.customProjects.indexOf(project);
    if (idx >= 0) {
      this.customProjects.splice(idx, 1);
    }
  }

  // print functions

  print(dateFormat = rootComponent.dateFormat) {
    let str = "### INBOX ###############################################";
    str += `\n${this.inboxProject.print(dateFormat)}`;

    str += "\n### PROJECTS ############################################";
    this.customProjects.forEach((proj) => {
      str += `\n\n${proj.print(dateFormat)}`;
      str += "\n_________________________________________________________";
    });

    return str;
  }
}
