import { uiIcons } from "../uiIcons.js";
import {
  initDiv,
  initP,
  initButton,
} from "../../js-utilities/commonDomComponents.js";
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
  F: "FILTERS AND TAGS",
  R: "RESULTS",
  S: "SEARCH",
};

export default function domMiniComponentMixin(targetClass, forNav = false) {
  if (forNav) {
    Object.assign(
      targetClass.prototype,
      redefineInitMiniNav(),
      redefineUpdateView()
    );
  } else {
    // This method is the original one, and will be redefined next
    const originalInitOtherInfo = targetClass.prototype.initOtherInfo;

    targetClass.cssClass = {
      ...targetClass.cssClass,
      expandBtn: `expand-btn`,
    };

    Object.assign(
      targetClass.prototype,
      redefineInitOtherInfo(originalInitOtherInfo),
      redefineInitMini(),
      initExpandBtn(),
      redefineUpdateView()
    );
  }
}

// Add generic methods to handle the lists ------------------------------

// callback
const btnRenderItemCallback = (e) => {
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
      this.div.appendChild(this.initIcon());
      this.div.appendChild(this.initTitle());

      this.div.appendChild(this.initActionButtons());

      this.div.append(this.initOtherInfo(true));

      this.div.associatedType = this.obj.type;
      this.div.associatedObject = this.obj;
      this.div.addEventListener("click", btnRenderItemCallback);
    },
  };
}

function redefineInitOtherInfo(originalInitOtherInfo) {
  return {
    initOtherInfo: function () {
      const div = originalInitOtherInfo.call(this, true);
      Object.values(this.obj.data.lists).forEach((list) => {
        div.append(initSubListSize.call(this, list));
      });

      return div;
    },
  };
}

function initSubListSize(list) {
  const cssClass = this.getCssClass("otherInfoDiv");
  const labelClass = `${cssClass}-label`;
  const contentClass = `${cssClass}-content`;

  const cssClassHidden = `${cssClass}__hidden`;

  const subListSizeDiv = initDiv(cssClass);

  const toggleHiddenClass = () =>
    subListSizeDiv.classList.toggle(cssClassHidden, list.size === 0);

  toggleHiddenClass();

  const subListIcon = initP(labelClass, list.icon);
  const subListCounter = initP(contentClass, null, list.sizeInfo.str);

  for (const token of list.sizeInfo.tokens) {
    PubSub.subscribe(token, (msg) => {
      console.log(msg);
      subListCounter.textContent = list.sizeInfo.str;
      toggleHiddenClass();
    });
  }

  subListSizeDiv.append(subListIcon, subListCounter);

  return subListSizeDiv;
}

function redefineInitMiniNav() {
  return {
    init: function () {
      // it becomes a method: 'this' is the object it will be attached to
      this.div = initDiv(this.constructor.blockName);
      this.div.appendChild(this.initIcon());
      this.div.appendChild(this.initTitle());
      if (this.initNTodoNestedIcon != null) {
        this.div.appendChild(this.initNTodoNestedIcon());
      } else if (this.initNTodoIcon != null) {
        this.div.appendChild(this.initNTodoIcon());
      }

      this.div.associatedType = this.obj.type;
      this.div.associatedObject = this.obj;
      this.div.addEventListener("click", btnRenderItemCallback);
    },
  };
}

function initExpandBtn() {
  return {
    initExpandBtn: function () {
      // it becomes a method: 'this' is the object it will be attached to
      const expandBtn = initButton(
        this.getCssClass("expandBtn"),
        btnRenderItemCallback,
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
      // do not show the parent, but keep the current view
    },
  };
}
