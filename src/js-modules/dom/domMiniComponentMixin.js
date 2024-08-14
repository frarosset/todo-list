import { uiIcons } from "./uiIcons.js";
import { initDiv, initButton } from "../../js-utilities/commonDomComponents.js";
import PubSub from "pubsub-js";

// Call
//   domMiniComponentMixin(className);
// after the definition of className class
// to add support for domMiniComponent view
// explotiong composition (using mixin), with this method:
// - init() -------------> redefined
// - initExpandBtn() ----> add visual button to open detailed view

// Mixin ----------------------------------------------------------------
const pubsubLabel = {
  P: "PROJECT",
  T: "TODO",
  N: "NOTE",
};

export default function domMiniComponentMixin(targetClass, forNav = false) {
  if (forNav) {
    Object.assign(
      targetClass.prototype,
      redefineInitMiniNav(),
      redefineUpdateView()
    );
  } else {
    targetClass.cssClass = {
      ...targetClass.cssClass,
      expandBtn: `expand-btn`,
    };

    Object.assign(
      targetClass.prototype,
      redefineInitMini(),
      initExpandBtn(),
      redefineUpdateView()
    );
  }
}

// Add generic methods to handle the lists ------------------------------

// callback
const btnRenderTodoCallback = (e) => {
  const type = pubsubLabel[e.currentTarget.associatedType];
  const obj = e.currentTarget.associatedObject;
  PubSub.publish(`RENDER ${type}`, obj);
  e.stopPropagation();
};

// redefine the init() method
function redefineInitMini() {
  return {
    init: function () {
      // it becomes a method: 'this' is the object it will be attached to
      this.div = initDiv(this.constructor.blockName);

      this.div.prepend(this.initExpandBtn());

      if (this.showPath) {
        this.div.appendChild(this.initPath());
      }
      this.div.appendChild(this.initTitle());

      this.div.appendChild(this.initActionButtons());

      this.div.append(this.initOtherInfo(true));

      this.div.associatedType = this.obj.type;
      this.div.associatedObject = this.obj;
      this.div.addEventListener("click", btnRenderTodoCallback);
    },
  };
}

function redefineInitMiniNav() {
  return {
    init: function () {
      // it becomes a method: 'this' is the object it will be attached to
      this.div = initDiv(this.constructor.blockName);
      this.div.appendChild(this.initTitle());
      this.div.appendChild(this.initNTodoNestedIcon());

      this.div.associatedType = this.obj.type;
      this.div.associatedObject = this.obj;
      this.div.addEventListener("click", btnRenderTodoCallback);
    },
  };
}

function initExpandBtn() {
  return {
    initExpandBtn: function () {
      // it becomes a method: 'this' is the object it will be attached to
      const expandBtn = initButton(
        this.getCssClass("expandBtn"),
        btnRenderTodoCallback,
        uiIcons.expand
      );
      expandBtn.associatedType = this.obj.type;
      expandBtn.associatedObject = this.obj;
      return expandBtn;
    },
  };
}

function redefineUpdateView() {
  return {
    updateView: function () {
      // it becomes a method: 'this' is the object it will be attached to
      PubSub.publish(
        this.obj.list.getPubSubName("REMOVE ITEM", "main"),
        this.div
      );
    },
  };
}
