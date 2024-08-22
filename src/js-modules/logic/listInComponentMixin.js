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
// - getProjectList(), getTodoList(), getNoteList(), getList(type)
// - addToProjectList(data), addToTodoList(data), addToNoteList(data), addToList(type,data)
// - insertToProjectList(obj), insertToTodoList(obj), insertToNoteList(obj), insertToList(type,obj)
// - removeFromProjectList(obj), removeFromTodoList(obj), removeFromNoteList(obj), removeToList(type,data)

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
  const originalPrint = targetClass.prototype.print;
  const originalToJSON = targetClass.prototype.toJSON;
  const originalFilterByNested = targetClass.prototype.filterByNested;
  const originalGetAllTagsNested = targetClass.prototype.getAllTagsNested;

  Object.assign(
    targetClass.prototype,
    initAllLists(whichListArray),
    allGetListMethod(whichListArray),
    allAddToListMethod(whichListArray),
    allInsertToListMethod(whichListArray),
    allRemoveFromListMethod(whichListArray),
    redefinePrint(originalPrint),
    redefineToJSON(originalToJSON),
    redefineFilterByNested(originalFilterByNested),
    redefineGetAllTagsNested(originalGetAllTagsNested),
    redefineGetAllOfTypeNested_withoutThis()
  );
}

// Initialize the Lists -------------------------------------------------

function initList(whichList, itemDataLists = {}, editable = true) {
  const listLabel = listData[whichList][0];
  const listClass = listData[whichList][1];
  const listTitle = listData[whichList][2];

  // Initialize the data object
  if (this.data.lists[listLabel] == null) {
    this.data.lists[listLabel] = new listClass(
      listTitle,
      this,
      itemDataLists[listLabel],
      editable
    );
  }
}

function initAllLists(whichListArray) {
  return {
    initAllLists: function (
      itemDataLists = {},
      listsToExclude = [],
      editable = true
    ) {
      this.data.lists = {};
      // it becomes a method: 'this' is the object it will be attached to
      whichListArray.forEach((whichList) => {
        if (!listsToExclude.includes(whichList))
          initList.call(this, whichList, itemDataLists, editable); // bind the function to this
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

  methods[name + "List"] = function (whichList, ...args) {
    const label = listData[whichList][0];
    const functionToCall = associatedFunction(label);
    return functionToCall.call(this, ...args); // bind the function to this
  };

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

// Initialize insert to list methods ---------------------------------------

function insertToListMethod(label) {
  return function (obj, primary = true) {
    return this.data.lists[label].insertItem(obj, primary);
  };
}

function allInsertToListMethod(whichListArray) {
  return initObjOfMethods(whichListArray, "insertTo", insertToListMethod);
}

// Initialize remove from list methods ----------------------------------

function removeFromListMethod(label) {
  return function (obj, primary = true) {
    /* obj is a reference to the object to remove*/
    this.data.lists[label].removeItem(obj, primary);
  };
}

function allRemoveFromListMethod(whichListArray) {
  return initObjOfMethods(whichListArray, "removeFrom", removeFromListMethod);
}

// Redefine print method ------------------------------------------------

function redefinePrint(originalPrint) {
  return {
    print: function (dateFormat = this.constructor.dateFormat) {
      // it becomes a method: 'this' is the object it will be attached to
      let str = originalPrint.call(this, dateFormat);
      Object.values(this.data.lists).forEach((listObj) => {
        str += listObj.print();
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

// Redefine getAllTagsNested method (serialization method) ------------------------
function redefineGetAllTagsNested(originalGetAllTagsNested) {
  return {
    getAllTagsNested: function () {
      // it becomes a method: 'this' is the object it will be attached to
      const tagsArr = [...originalGetAllTagsNested.call(this)];

      Object.values(this.data.lists).forEach((listObj) => {
        tagsArr.push(...listObj.getAllTagsNested());
      });

      return new Set(tagsArr);
    },
  };
}

// Redefine getAllOfTypeNested_withoutThis method (serialization method) ------------------------
function redefineGetAllOfTypeNested_withoutThis() {
  return {
    getAllOfTypeNested_withoutThis: function (type) {
      // it becomes a method: 'this' is the object it will be attached to
      const matchArray = [];

      Object.values(this.data.lists).forEach((listObj) => {
        matchArray.push(...listObj.getAllOfTypeNested(type));
      });

      return matchArray;
    },
  };
}
