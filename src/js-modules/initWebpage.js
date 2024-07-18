import projectComponent from "./projectComponent";
import todoComponent from "./todoComponent.js";

const sampleProject = {
  title: "My First Project",
  description: "Just a test for the projectComponent class.",
  tags: new Set(["test", "first"]),
};

const sampleTodo = {
  title: "My First Todo",
  description: "Just a test for the todoComponent class.",
  dueDate: null,
  priority: 1,
  state: 0,
  imminence: 0,
  associatedProjectId: null,
  tags: new Set(["test", "todo"]),
};

export default function initWebpage() {
  const project1 = new projectComponent(sampleProject);
  const project2 = new projectComponent(sampleProject);

  console.log(project1.print());
  console.log(project2.print());

  const todo1 = new todoComponent(sampleTodo);
  const todo2 = new todoComponent(sampleTodo);

  console.log(todo1.print());
  console.log(todo2.print());

  project1.addTag("easy");
  project1.addTag("test");
  project1.removeTag("todo");
  console.log(project1.print());

  project1.addTodo(sampleTodo);
  project1.addTodo(sampleTodo);
  project1.addTodo(sampleTodo);
  project1.addTodo(sampleTodo);
  console.log(project1.print());

  project1.removeTodo(project1.todos[1]);
  console.log(project1.print());

  project1.removeTodo(project1.todos[1]);
  console.log(project1.print());
}
