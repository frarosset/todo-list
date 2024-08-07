import { projectListComponent } from "./fixCircularDependenciesInComponents.js";
import { todoListComponent } from "./fixCircularDependenciesInComponents.js";
import { noteListComponent } from "./fixCircularDependenciesInComponents.js";

// Call
//   listInComponentMixin(className, ["T", "P", "N"]);
// after the definition of className class
// to add support for todoList (T), projectList (P), noteList (N)
// explotiong composition (using mixin), with these methods:
// - initAllLists -------------> must be called in the constructor
// - print()  -----------------> redefined
// - getProjectList(), getTodoList(), getNoteList()
// - addToProjectList(data), addToTodoList(data), addToNoteList(data)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj)

const listData = {
  P: [
    "projectList", // variable label
    projectListComponent, // class
    "Projects", // displayed title
  ],
  SP: [
    "projectList", // variable label
    projectListComponent, // class
    "Sub-Projects", // displayed title
  ],
  T: [
    "todoList", // variable label
    todoListComponent, // class
    "Todo", // displayed title
  ],
  ST: [
    "todoList", // variable label
    todoListComponent, // class
    "Sub-Tasks", // displayed title
  ],
  N: [
    "noteList", // variable label
    noteListComponent, // class
    "Notes", // displayed title
  ],
  SN: [
    "noteList", // variable label
    noteListComponent, // class
    "Replies", // displayed title
  ],
};

// Mixin ----------------------------------------------------------------

// specify the lists you want (P,T,N) in the whichListArray

export default function listInComponentMixin(targetClass, whichListArray) {
  // This method is the original one, and will be redefined next
  const originalToJSON = targetClass.prototype.toJSON;
  const originalFilterByNested = targetClass.prototype.filterByNested;

  Object.assign(
    targetClass.prototype,
    initAllLists(whichListArray),
    allGetListMethod(whichListArray),
    allAddToListMethod(whichListArray),
    allRemoveFromListMethod(whichListArray),
    redefinePrint(whichListArray),
    redefineToJSON(originalToJSON),
    redefineFilterByNested(originalFilterByNested)
  );
}

// Initialize the Lists -------------------------------------------------

function initList(whichList, itemDataLists = {}) {
  const listLabel = listData[whichList][0];
  const listClass = listData[whichList][1];
  const listTitle = listData[whichList][2];

  // Initialize the data object
  if (this.data.lists[listLabel] == null) {
    this.data.lists[listLabel] = new listClass(
      listTitle,
      this,
      itemDataLists[listLabel]
    );
  }
}

function initAllLists(whichListArray) {
  return {
    initAllLists: function (itemDataLists = {}) {
      this.data.lists = {};
      // it becomes a method: 'this' is the object it will be attached to
      whichListArray.forEach((whichList) => {
        initList.call(this, whichList, itemDataLists); // bind the function to this
      });
    },
  };
}

// Add generic methods to handle the lists ------------------------------

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function initObjOfMethods(whichListArray, name, associatedFunction) {
  const methods = {};
  whichListArray.forEach((whichList) => {
    const label = listData[whichList][0];
    const methodName = `${name}${capitalizeFirstLetter(label)}`;

    methods[methodName] = associatedFunction(label);
  });
  return methods;
}

// Initialize get methods -----------------------------------------------

function getListMethod(label) {
  return function () {
    return this.data.lists[label];
  };
}

function allGetListMethod(whichListArray) {
  return initObjOfMethods(whichListArray, "get", getListMethod);
}

// Initialize add to list methods ---------------------------------------

function addToListMethod(label) {
  return function (data) {
    return this.data.lists[label].addItem(data);
  };
}

function allAddToListMethod(whichListArray) {
  return initObjOfMethods(whichListArray, "addTo", addToListMethod);
}

// Initialize remove from list methods ----------------------------------

function removeFromListMethod(label) {
  return function (obj) {
    /* obj is a reference to the object to remove*/
    this.data.lists[label].removeItem(obj);
  };
}

function allRemoveFromListMethod(whichListArray) {
  return initObjOfMethods(whichListArray, "removeFrom", removeFromListMethod);
}

// Redefine print method ------------------------------------------------

function redefinePrint(whichListArray) {
  return {
    print: function (dateFormat = this.constructor.dateFormat) {
      // it becomes a method: 'this' is the object it will be attached to
      let str = this.printBaseInfo(dateFormat);
      whichListArray.forEach((whichList) => {
        const label = listData[whichList][0];
        str += this.data.lists[label].print();
      });
      return str;
    },
  };
}

// Redefine toJSON method (serialization method) ------------------------

function redefineToJSON(originalToJSON) {
  return {
    toJSON: function () {
      // it becomes a method: 'this' is the object it will be attached to
      const obj = originalToJSON.call(this);
      obj.lists = {};
      Object.entries(this.data.lists).forEach(([listLabel, listObj]) => {
        obj.lists[listLabel] = listObj.toJSON();
      });
      return obj;
    },
  };
}

// Redefine toJSON method (serialization method) ------------------------
function redefineFilterByNested(originalFilterByNested) {
  return {
    filterByNested: function (variable, value) {
      // it becomes a method: 'this' is the object it will be attached to
      const matchArray = originalFilterByNested.call(this, variable, value);

      Object.values(this.data.lists).forEach((listObj) => {
        matchArray.push(...listObj.filterByNested(variable, value));
      });

      // console.log(
      //   `FilterByNested (${variable},${value}) (mixin) of '${this.title}':`,
      //   matchArray
      // ); // debug

      return matchArray;
    },
  };
}
