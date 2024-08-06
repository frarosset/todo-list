import rootComponent from "./logic/rootComponent.js";
import domStructure from "./dom/domStructure.js";
import sampleDataJSON from "../sampleData.json";
import PubSub from "pubsub-js";

export default function initWebpage() {
  // some sample data -> todo: read from localstorage or some defaultData.json
  // Stringify the sampleDataJSON to match the input required by rootComponent (it will be parsed with a reviver in there)
  const rootDataJSON = JSON.stringify(sampleDataJSON);

  const root = new rootComponent(rootDataJSON);

  console.log(root.print());

  // subscribe to EDITED token
  PubSub.subscribe("EDITED -> saving into localStorage", (msg) => {
    console.log(msg);
    // Get a JSON representation of the data and save it to local storage
    const currentRootDataJSON = JSON.stringify(root);
    localStorage.setItem("rootDataJSON", currentRootDataJSON);
  });

  //Build the dom structure
  new domStructure(root);
}
