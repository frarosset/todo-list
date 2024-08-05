import {
  projectComponent,
  todoComponent,
  noteComponent,
} from "./fixCircularDependenciesInComponents";
import { projectListComponent } from "./fixCircularDependenciesInComponents.js";

export default class rootComponent {
  #inboxProject;
  #customProjectsList;

  static dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

  constructor() {
    // Generic project
    this.#inboxProject = new projectComponent({ title: "Inbox" }); // no parent, no list

    // Custom projects list
    this.#customProjectsList = new projectListComponent("Projects", null);
  }

  // Getter methods
  get inboxProject() {
    return this.#inboxProject;
  }

  get customProjectsList() {
    return this.#customProjectsList;
  }

  get customProjects() {
    // todo remove
    return this.#customProjectsList.list;
  }

  // Add / remove custom project

  addProject(data) {
    return this.#customProjectsList.addItem(data);
  }

  removeProject(project) {
    this.#customProjectsList.removeItem(project);
  }

  // print functions

  print(dateFormat = rootComponent.dateFormat) {
    let str = "### INBOX ###############################################";
    str += `\n${this.inboxProject.print(dateFormat)}`;

    str += "\n### PROJECTS ############################################";
    str += this.#customProjectsList.print();

    return str;
  }

  // Serialization method
  toJSON() {
    // nextId of the projectComponent, todoComponent, noteComponent classes needs to be memorized
    return {
      nextId: {
        projectComponent: projectComponent.nextId,
        todoComponent: todoComponent.nextId,
        noteComponent: noteComponent.nextId,
      },
      inboxProject: this.#inboxProject.toJSON(),
      customProjectsList: this.#customProjectsList.toJSON(),
    };
  }
}
