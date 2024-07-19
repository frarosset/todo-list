import rootComponent from "./rootComponent.js";
import domStructure from "./domStructure.js";

const sampleProject0 = {
  title: "My First Project",
  description: "Just a test for the projectComponent class.",
  tags: new Set(["test", "first"]),
};

const sampleProject1 = {
  title: "My Second Project",
  description: "Just a test for the projectComponent class.",
  tags: new Set(["test", "second"]),
};

const sampleProject2 = {
  title: "My Third Project",
  description: "Just a test for the projectComponent class.",
  tags: new Set(["test", "third"]),
};

const sampleTodo0 = {
  title: "My First Todo",
  description: "Just a test for the todoComponent class.",
  tags: new Set(["test", "first"]),
  dueDate: new Date("2024/06/20"),
  priority: 1,
  state: 0,
};

const sampleTodo1 = {
  title: "My Second Todo",
  description: "Just a test for the todoComponent class.",
  tags: new Set(["test", "second"]),
  dueDate: new Date("2024/08/20"),
  priority: 1,
  state: 0,
};

const sampleTodo2 = {
  title: "My Third Todo",
  description: "Just a test for the todoComponent class.",
  tags: new Set(["test", "third"]),
  dueDate: new Date("2024/07/20"),
  priority: 1,
  state: 0,
};

export default function initWebpage() {
  const root = new rootComponent();

  const project0 = root.addProject(sampleProject0); //root.customProjects[0]
  const project1 = root.addProject(sampleProject1); //root.customProjects[1]
  const project2 = root.addProject(sampleProject2); //root.customProjects[2]
  const todo0 = project2.addTodo(sampleTodo0);
  const todo1 = project2.addTodo(sampleTodo1);
  const todo2 = project0.addTodo(sampleTodo2);
  const todo4 = root.inboxProject.addTodo(sampleTodo1);

  console.log(root.print());
  // todo: read data from json

  //Build the dom structure
  new domStructure(root);
}
