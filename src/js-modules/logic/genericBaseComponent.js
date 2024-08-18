export default class genericBaseComponent {
  data;

  static icon = null;

  static defaultData = {
    id: null,
    title: "",
    icon: null,
  };
  static nextId = 0;

  extractData(data) {
    const dataProperties = Object.keys(this.constructor.defaultData);
    const extractedData = dataProperties
      .filter((key) => key in data)
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    return extractedData;
  }

  constructor(data, parent = null) {
    this.data = Object.assign(
      {},
      this.constructor.defaultData,
      this.extractData(data)
    );

    if (this.data.id == null) {
      this.data.id = this.constructor.nextId;
      this.constructor.nextId++;
    }

    this.parent = parent;
    this.type = "";
  }

  // print functions

  printPath() {
    return (
      this.path.reduce((str, obj) => {
        str += `${obj.type}${obj.id}/`;
        return str;
      }, "") + `${this.type}${this.id}`
    );
  }

  print() {
    return `${this.printPath()}) '${this.title}'`;
  }

  // Getter methods
  get id() {
    return this.data.id;
  }

  get title() {
    return this.data.title;
  }

  get icon() {
    if (this.data.icon) {
      return this.data.icon;
    } else {
      return this.constructor.icon;
    }
  }

  get path() {
    const path = [];
    let obj = this.parent;
    while (obj != null) {
      path.unshift(obj);
      obj = obj.parent;
    }
    return path;
  }

  get pathAndThis() {
    return [this.path, this];
  }

  get pathStr() {
    return this.path.reduce((str, obj) => {
      str += `${obj.title} / `;
      return str;
    }, "");
  }

  get pathAndThisStr() {
    return this.pathStr + this.title;
  }
}
