import { initP } from "../../js-utilities/commonDomComponents.js";
import genericBaseDomComponent from "./genericBaseDomComponent.js";
import { listInDomComponentMixin } from "./fixCircularDependenciesInDomComponents.js";
import PubSub from "pubsub-js";

export default class resultsDomComponent extends genericBaseDomComponent {
  static blockName = "results-div";

  static cssClass = {
    ...genericBaseDomComponent.cssClass,
    nTodoIcon: `n-todo-icon`,
  };

  getPubSubName(str, topic = null) {
    return this.obj.getPubSubName(str, topic);
  }

  constructor(obj, showPath = true) {
    super(obj, showPath);
  }

  init() {
    super.init();
    this.initAllDomLists(); // method added via composition (see below), hide path
  }

  initNTodoIcon() {
    const cssClass = this.getCssClass("nTodoIcon");
    const cssClassHidden = `${cssClass}__hidden`;

    const nTodoIcon = initP(cssClass, null, this.obj.nTodo);
    const toggleHiddenClass = () =>
      nTodoIcon.classList.toggle(cssClassHidden, this.obj.nTodo === 0);

    toggleHiddenClass();

    // Set the tooltip when hovering
    nTodoIcon.title = `Todo yet to be done`;

    PubSub.subscribe(this.getPubSubName("NTODO CHANGE", "main"), (msg) => {
      console.log(msg);
      nTodoIcon.textContent = `${this.obj.nTodo}`;
      toggleHiddenClass();
    });

    return nTodoIcon;
  }
}

// Add todoDomList, projectDomList, noteDomList (based on what is defined in this.obj.list)
// with composition (using mixin) with this method:
// - initAllDomLists -------------> must be called in the constructor
listInDomComponentMixin(resultsDomComponent);
