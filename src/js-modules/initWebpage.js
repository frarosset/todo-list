import projectComponent from "./projectComponent";
import todoComponent from "./todoComponent";

const sampleProject = {
  title: "My First Project",
  description: "Just a test for the projectComponent class.",
};

const sampleTodo = {
  title: "My First Todo",
  description: "Just a test for the todoComponent class.",
  dueDate: null,
  priority: 1,
  state: 0,
  imminence: 0,
  associatedProjectId: null,
  tags: ["test", "todo"],
};

export default function initWebpage() {
  const project1 = new projectComponent(sampleProject);
  const project2 = new projectComponent(sampleProject);
  const project3 = new projectComponent(sampleProject);

  console.log(project1.print());
  console.log(project2.print());
  console.log(project3.print());

  const todo1 = new todoComponent(sampleTodo);
  const todo2 = new todoComponent(sampleTodo);

  console.log(todo1.print());
  console.log(todo2.print());
}
