import projectComponent from "./projectComponent";

const sampleProject = {
  title: "My First Project",
  description: "Just a test for the projectComponent class.",
};

export default function initWebpage() {
  const project1 = new projectComponent(sampleProject);
  const project2 = new projectComponent(sampleProject);
  const project3 = new projectComponent(sampleProject);

  console.log(project1.print());
  console.log(project2.print());
  console.log(project3.print());
}
