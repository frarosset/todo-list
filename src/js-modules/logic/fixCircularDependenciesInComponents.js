// This module implements the 'internal module pattern' for a subset of modules
// whose import would introduce circular dependencies.
// This pattern gives full control over the module loading order.
// Whenever you need one of these modules, you have to import it directly from this file.
// Despite circular dependencies remains, they are only in this module,
// and are resolved natively by Javascript.
// Import the files here in the right order: import first the modules which are then extended
// or the mixins, which need to be defined to define the classes imported next.
// see https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

import projectListComponent from "./projectListComponent.js";
import todoListComponent from "./todoListComponent.js";
import noteListComponent from "./noteListComponent.js";

import listInComponentMixin from "./listInComponentMixin.js";

import projectComponent from "./projectComponent.js";
import todoComponent from "./todoComponent.js";
import noteComponent from "./noteComponent.js";

export {
  projectComponent,
  todoComponent,
  noteComponent,
  projectListComponent,
  todoListComponent,
  noteListComponent,
  listInComponentMixin,
};
