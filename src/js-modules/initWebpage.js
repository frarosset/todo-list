import rootComponent from "./logic/rootComponent.js";
import domStructure from "./dom/domStructure.js";

// const sampleProject0 = {
//   title: "My First Project",
//   description: "Just a test for the projectComponent class.",
//   tags: new Set(["test", "first"]),
// };

// const sampleProject1 = {
//   title: "My Second Project",
//   description: "Just a test for the projectComponent class.",
//   tags: new Set(["test", "second"]),
// };

// const sampleProject2 = {
//   title: "My Third Project",
//   description: "Just a test for the projectComponent class.",
//   tags: new Set(["test", "third"]),
// };

// const sampleTodo0 = {
//   title: "My First Todo",
//   description: "Just a test for the todoComponent class.",
//   tags: new Set(["test", "first"]),
//   dueDate: new Date("2024/06/20"),
//   priority: 0,
//   state: 2,
// };

// const sampleTodo1 = {
//   title: "My Second Todo",
//   description: "Just a test for the todoComponent class.",
//   tags: new Set(["test", "second"]),
//   dueDate: new Date("2024/08/20"),
//   priority: 1,
//   state: 1,
// };

// const sampleTodo2 = {
//   title: "My Third Todo",
//   description: "Just a test for the todoComponent class.",
//   tags: new Set(["test", "third"]),
//   priority: 2,
//   state: 0,
// };

// const sampleTodo3 = {
//   title: "My Fourth Todo",
//   description: "Just a test for the todoComponent class.",
//   tags: new Set(["test", "4"]),
//   dueDate: new Date("2024/07/24"),
//   priority: 3,
//   state: 0,
// };

export default function initWebpage() {
  // some sample data -> todo: read from localstorage or some defaultData.json
  const rootDataJSON =
    '{"nextId":{"projectComponent":4,"todoComponent":5,"noteComponent":0},"inboxProject":{"id":0,"title":"Inbox","description":"","tags":[],"dateOfCreation":"2024-08-05T23:19:46.321Z","dateOfEdit":"2024-08-05T23:19:46.336Z","lists":{"todoList":[{"id":4,"title":"My Second Todo","description":"Just a test for the todoComponent class.","tags":["test","second"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"dueDate":"2024-08-19T22:00:00.000Z","priority":1,"state":1,"lists":{"todoList":[],"noteList":[]}}],"projectList":[],"noteList":[]}},"customProjectsList":[{"id":1,"title":"My First Project","description":"Just a test for the projectComponent class.","tags":["test","first"],"dateOfCreation":"2024-08-05T23:19:46.321Z","dateOfEdit":"2024-08-05T23:19:46.336Z","lists":{"todoList":[{"id":2,"title":"My Third Todo","description":"Just a test for the todoComponent class.","tags":["test","third"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"dueDate":null,"priority":2,"state":0,"lists":{"todoList":[],"noteList":[]}}],"projectList":[],"noteList":[]}},{"id":2,"title":"My Second Project","description":"Just a test for the projectComponent class.","tags":["test","second"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"lists":{"todoList":[],"projectList":[],"noteList":[]}},{"id":3,"title":"My Third Project","description":"Just a test for the projectComponent class.","tags":["test","third"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":"2024-08-05T23:19:46.336Z","lists":{"todoList":[{"id":0,"title":"My First Todo","description":"Just a test for the todoComponent class.","tags":["test","first"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"dueDate":"2024-06-19T22:00:00.000Z","priority":0,"state":2,"lists":{"todoList":[],"noteList":[]}},{"id":1,"title":"My Second Todo","description":"Just a test for the todoComponent class.","tags":["test","second"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"dueDate":"2024-08-19T22:00:00.000Z","priority":1,"state":1,"lists":{"todoList":[],"noteList":[]}},{"id":3,"title":"My Fourth Todo","description":"Just a test for the todoComponent class.","tags":["test","4"],"dateOfCreation":"2024-08-05T23:19:46.336Z","dateOfEdit":null,"dueDate":"2024-07-23T22:00:00.000Z","priority":3,"state":0,"lists":{"todoList":[],"noteList":[]}}],"projectList":[],"noteList":[]}}]}';
  //console.log(rootDataJSON, JSON.parse(rootDataJSON));

  const root = new rootComponent(rootDataJSON);

  // Add some data to make sure the nextId are properly restored
  // const project0 = root.addProject(sampleProject0);
  // root.addProject(sampleProject1);
  // const project2 = root.addProject(sampleProject2);
  // project2.addToTodoList(sampleTodo0);
  // project2.addToTodoList(sampleTodo1);
  // project0.addToTodoList(sampleTodo2);
  // project2.addToTodoList(sampleTodo3);
  // root.inboxProject.addToTodoList(sampleTodo1);

  console.log(root.print());
  // todo: read data from json

  //Build the dom structure
  new domStructure(root);

  console.log(JSON.stringify(root));
}
