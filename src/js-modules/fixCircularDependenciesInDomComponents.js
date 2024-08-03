// This module implements the 'internal module pattern' for a subset of modules
// whose import would introduce circular dependencies.
// This pattern gives full control over the module loading order.
// Whenever you need one of these modules, you have to import it directly from this file.
// Despite circular dependencies remains, they are only in this module,
// and are resolved natively by Javascript.
// Import the files here in the right order: import first the modules which are then extended
// or the mixins, which need to be defined to define the classes imported next.
// see https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

import projectListDomComponent from "./projectListDomComponent.js";
import todoListDomComponent from "./todoListDomComponent.js";
import noteListDomComponent from "./noteListDomComponent.js";

import listInDomComponentMixin from "./listInDomComponentMixin.js";

import projectDomComponent from "./projectDomComponent.js";
import todoDomComponent from "./todoDomComponent.js";
import noteDomComponent from "./noteDomComponent.js";

import projectDomMiniComponent from "./projectDomMiniComponent.js";
import todoDomMiniComponent from "./todoDomMiniComponent.js";
import noteDomMiniComponent from "./noteDomMiniComponent.js";

export {
  projectDomComponent,
  todoDomComponent,
  noteDomComponent,
  projectDomMiniComponent,
  todoDomMiniComponent,
  noteDomMiniComponent,
  projectListDomComponent,
  todoListDomComponent,
  noteListDomComponent,
  listInDomComponentMixin,
};
