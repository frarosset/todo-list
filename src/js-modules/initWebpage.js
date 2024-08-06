import rootComponent from "./logic/rootComponent.js";
import domStructure from "./dom/domStructure.js";
import sampleDataJSON from "../sampleData.json";

export default function initWebpage() {
  // some sample data -> todo: read from localstorage or some defaultData.json
  // Stringify the sampleDataJSON to match the input required by rootComponent (it will be parsed with a reviver in there)
  const rootDataJSON = JSON.stringify(sampleDataJSON);

  const root = new rootComponent(rootDataJSON);

  console.log(root.print());

  //Build the dom structure
  new domStructure(root);
}
