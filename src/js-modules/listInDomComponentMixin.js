import { projectListDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { todoListDomComponent } from "./fixCircularDependenciesInDomComponents.js";
import { noteListDomComponent } from "./fixCircularDependenciesInDomComponents.js";

// Call
//   listInDomComponentMixin(className);
// after the definition of className class
// to add support for todoDomList, projectDomList, noteDomList,
// (based on what is defined in this.obj.list)
// explotiong composition (using mixin), with this method:
// - initAllLists -------------> must be called in the constructor

// Mixin ----------------------------------------------------------------
const initDomListFor = {
  projectList: projectListDomComponent,
  todoList: todoListDomComponent,
  noteList: noteListDomComponent,
};

export default function listInDomComponentMixin(targetClass) {
  Object.assign(targetClass.prototype, initAllDomLists());
}

// Add generic methods to handle the lists ------------------------------

function initDomList(listLabel, parent) {
  // Initialize the dom objects
  const objDom = new initDomListFor[listLabel](parent);
  this.content.appendChild(objDom.div);
}

function initAllDomLists() {
  return {
    initAllDomLists: function () {
      // it becomes a method: 'this' is the object it will be attached to
      Object.entries(this.obj.data.lists).forEach(([listLabel, list]) => {
        initDomList.call(this, listLabel, list); // bind the function to this
      });
    },
  };
}
