import { differenceInMilliseconds, isAfter, addDays } from "date-fns";
import {
  projectComponent,
  todoComponent,
  noteComponent,
} from "./fixCircularDependenciesInComponents";
import { projectListComponent } from "./fixCircularDependenciesInComponents.js";
import PubSub from "pubsub-js";
import { uiIcons } from "../uiIcons.js";

export default class rootComponent {
  #inboxProject;
  #customProjectsList;

  static dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";
  static defaultInboxData = {
    title: "Inbox",
    dateOfCreation: null,
  };

  constructor(dataJSON = null) {
    let inboxProjectData;
    let customProjectsListData;

    // apply data from dataJSON, if provided
    if (dataJSON) {
      const parsedData = JSON.parse(dataJSON, this.#parseReviver);

      this.#restoreNextId(parsedData.nextId);

      inboxProjectData = parsedData.inboxProject;
      customProjectsListData = parsedData.customProjectsList;
    } else {
      inboxProjectData = rootComponent.defaultInboxData;
      customProjectsListData = [];
    }

    inboxProjectData = {
      ...inboxProjectData,
      icon: uiIcons.inbox,
    };

    // Generic project
    this.#inboxProject = new projectComponent(
      inboxProjectData,
      null,
      null,
      false,
      ["SP"]
    ); // no parent, no list, no editable

    // Custom projects list
    this.#customProjectsList = new projectListComponent(
      "Projects",
      null,
      customProjectsListData
    );

    this.scheduleUpdateImminence();
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

  // Deserialization methods
  #restoreNextId(parsedNextId) {
    if (!parsedNextId) {
      return;
    }

    if (parsedNextId.projectComponent) {
      projectComponent.nextId = parsedNextId.projectComponent;
    }

    if (parsedNextId.todoComponent) {
      todoComponent.nextId = parsedNextId.todoComponent;
    }

    if (parsedNextId.noteComponent) {
      noteComponent.nextId = parsedNextId.noteComponent;
    }
  }

  #parseReviver(key, value) {
    const dateKeys = ["dateOfCreation", "dateOfEdit", "dueDate"];
    const setKeys = ["tags"];
    if (dateKeys.includes(key) && value != null) {
      return new Date(value);
    } else if (setKeys.includes(key)) {
      return new Set(value);
    } else {
      return value;
    }
  }

  // Filters and sizes

  filterByNested(variable, value) {
    const matchArray = this.#inboxProject.filterByNested(variable, value);

    matchArray.push(
      ...this.#customProjectsList.filterByNested(variable, value)
    );

    return matchArray;
  }

  sizeByNested(variable, value) {
    return this.filterByNested(variable, value).length;
  }

  search(lookupStr, variableArr = ["title", "description", "tag"]) {
    const matchArray = this.#inboxProject.search(lookupStr, variableArr);

    matchArray.push(...this.#customProjectsList.search(lookupStr, variableArr));

    return matchArray;
  }

  getAllTagsNested() {
    const inboxTagsSet = this.#inboxProject.getAllTagsNested();
    const customProjectsListTagsSet =
      this.#customProjectsList.getAllTagsNested();

    return new Set([...inboxTagsSet, ...customProjectsListTagsSet]);
  }

  getAllOfTypeNested(type) {
    const matchArray = this.#inboxProject.getAllOfTypeNested(type);
    matchArray.push(...this.#customProjectsList.getAllOfTypeNested(type));
    return matchArray;
  }

  // Update imminence at midnight
  scheduleUpdateImminence(hh = 0, mm = 0, ss = 0) {
    const now = new Date();
    const [YY, MM, DD] = [
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ];

    let scheduleAt = new Date(YY, MM, DD, hh, mm, ss);
    while (isAfter(now, scheduleAt)) {
      scheduleAt = addDays(scheduleAt, 1);
    }

    //console.log(now, "FORCE IMMINENCE UPDATE");
    PubSub.publish("FORCE IMMINENCE UPDATE");

    const delayInMs = differenceInMilliseconds(scheduleAt, now);
    setTimeout(() => {
      this.scheduleUpdateImminence(hh, mm, ss);
    }, delayInMs);
  }
}
