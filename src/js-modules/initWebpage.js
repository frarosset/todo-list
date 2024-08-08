import rootComponent from "./logic/rootComponent.js";
import domStructure from "./dom/domStructure.js";
import sampleDataJSONObj from "../sampleData.json";
import PubSub from "pubsub-js";

export default function initWebpage() {
  const root = new rootComponent(getRootDataJSON());

  subscribeToSetRootDataJSON(root);

  //Build the dom structure
  new domStructure(root);

  //temporary code to test the new functions *to be removed todo
  console.log("customProjectsSize", root.customProjectsList.size);
  root.customProjectsList.list.forEach((prj) => {
    console.log(
      "todoListSize",
      prj.data.lists.todoList.size,
      prj.data.lists.todoList.sizeBy("state", 2),
      prj.data.lists.todoList.sizeBy("imminence", 3),
      prj.data.lists.todoList.sizeBy("priority", 3),
      prj.data.lists.todoList.sizeBy("title", "My od "),
      prj.data.lists.todoList.sizeBy("tags", "test")
    );
    console.log("projectsListSize", prj.data.lists.projectList.size);
    console.log("noteListSize", prj.data.lists.noteList.size);
  });

  console.log(
    "customProjectsListNested",
    root.customProjectsList.filterByNested("title", "first"),
    root.customProjectsList.filterByNested("tags", "test"),
    root.customProjectsList.filterByNested("state", 2)
  );

  console.log(
    "root",
    root.filterByNested("title", "first"),
    root.filterByNested("tags", "test"),
    root.filterByNested("state", 2)
  );

  console.log("search", root.search("My first"), root.search("test"));
}

function getRootDataJSON() {
  // try to load from localStorage
  const localStorageDataJSON = localStorage.getItem("rootDataJSON");
  if (localStorageDataJSON) {
    return localStorageDataJSON;
  }

  // load some sample data from sampleData.json
  // Stringify the sampleDataJSON to match the input required by rootComponent (it will be parsed with a reviver in there)
  const sampleDataJSON = JSON.stringify(sampleDataJSONObj);
  if (sampleDataJSON !== "{}") {
    return sampleDataJSON;
  } else {
    // if empty ({}), return null
    return null;
  }
}

function subscribeToSetRootDataJSON(root) {
  const saveData = (root) => {
    // Get a JSON representation of the data and save it to local storage
    const currentRootDataJSON = JSON.stringify(root);
    localStorage.setItem("rootDataJSON", currentRootDataJSON);
  };

  saveData(root);

  // subscribe to EDITED token
  PubSub.subscribe("EDITED", (msg) => {
    console.log(`${msg} -> saving into localStorage`);
    saveData(root);
  });
}
