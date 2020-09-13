"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.MapboxLayersControl = void 0;
var DEFAULT_POSITION = "top-right";
var MapboxLayersControl = (function () {
  function MapboxLayersControl(_a) {
    var layersDefinition = _a.layersDefinition,
      _b = _a.title,
      title = _b === void 0 ? "" : _b;
    this._parentsIds = {};
    this._visibilities = {
      active: false,
      parentId: "",
      ids: [
        {
          id: "",
          name: "",
        },
      ],
    };
    this._definition = layersDefinition;
    this._title = title;
  }
  Object.defineProperty(MapboxLayersControl.prototype, "layersDefinition", {
    get: function () {
      return this._definition;
    },
    enumerable: false,
    configurable: true,
  });
  MapboxLayersControl.prototype.getDefaultPosition = function () {
    return DEFAULT_POSITION;
  };
  MapboxLayersControl.prototype._getVisibility = function (map, id) {
    return map.getLayoutProperty(id, "visibility");
  };
  MapboxLayersControl.prototype._setVisibility = function (map, id, value) {
    map.setLayoutProperty(id, "visibility", value);
  };
  MapboxLayersControl.prototype._checkInitialVisibility = function (map, id) {
    if (this._getVisibility(map, id) === "visible") {
      return true;
    }
    return false;
  };
  MapboxLayersControl.prototype._checkAllVisible = function (map, ids) {
    var allAreVisible = true;
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
      var id = ids_1[_i].id;
      if (this._getVisibility(map, id) === "none") {
        allAreVisible = false;
        break;
      }
    }
    return allAreVisible;
  };
  MapboxLayersControl.prototype._checkAllChecked = function (data) {
    var allChecked = true;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
      var id = data_1[_i].id;
      var childNode = document.querySelector("#" + id);
      if (!childNode.checked) {
        allChecked = false;
        break;
      }
    }
    return allChecked;
  };
  MapboxLayersControl.prototype._setParentsChecks = function (map, data, parentId, checked) {
    var parentNode = document.querySelector("#" + parentId);
    parentNode.checked = checked;
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
      var id = data_2[_i].id;
      var node = document.querySelector("#" + id);
      this._setVisibility(map, id, checked ? "visible" : "none");
      node.checked = checked;
    }
  };
  MapboxLayersControl.prototype._setChildrenChecks = function (map, id, checked, data, parentId) {
    var node = document.querySelector("#" + id);
    if (!checked) {
      this._setVisibility(map, id, "none");
      node.checked = false;
    } else {
      this._setVisibility(map, id, "visible");
      node.checked = true;
    }
    var parentNode = document.querySelector("#" + parentId);
    parentNode.checked = this._checkAllChecked(data);
  };
  MapboxLayersControl.prototype._idGenerator = function () {
    return "parent-id-" + Math.random().toString(36).substr(2, 9);
  };
  MapboxLayersControl.prototype._createCheckboxes = function (map, id, name, active, isParent, data, parentsIdsIdx) {
    var _this = this;
    var _a, _b;
    var layerContainer = document.createElement("div");
    layerContainer.classList.add("mapboxgl-ctrl-layers-control__" + (isParent ? "all" : "layer") + "-container");
    if (isParent && !active) {
      layerContainer.style.display = "none";
    }
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.name = id;
    input.checked = isParent ? this._checkAllVisible(map, data) : active;
    input.addEventListener("click", function (e) {
      var _a = e.target,
        checked = _a.checked,
        id = _a.id,
        name = _a.name;
      var hasParent = name.includes("parent");
      hasParent
        ? _this._setParentsChecks(map, data, id, checked)
        : _this._setChildrenChecks(map, id, checked, data, _this._parentsIds[parentsIdsIdx]);
    });
    input.classList.add("mapboxgl-ctrl-layers-control__checkbox");
    var label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = name;
    layerContainer.appendChild(input);
    layerContainer.appendChild(label);
    if (this._groupContainer) {
      (_a = this._groupContainer) === null || _a === void 0 ? void 0 : _a.appendChild(layerContainer);
      (_b = this._layersContainer) === null || _b === void 0 ? void 0 : _b.appendChild(this._groupContainer);
    }
  };
  MapboxLayersControl.prototype._splitInfo = function (map) {
    var _a;
    var parents = Object.values(this._visibilities);
    for (var i in parents) {
      if (typeof parents[i] === "object" && !Array.isArray(parents[i])) {
        var _b = parents[i],
          active = _b.active,
          ids = _b.ids,
          parentId = _b.parentId;
        this._parentsIds = __assign(__assign({}, this._parentsIds), ((_a = {}), (_a[i] = this._idGenerator()), _a));
        this._groupContainer = document.createElement("div");
        this._groupContainer.id = "group-" + this._parentsIds[i];
        this._groupContainer.classList.add("mapboxgl-ctrl-layers-control__group-container");
        this._createCheckboxes(map, this._parentsIds[i], parentId, active, true, ids, "");
        for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
          var _c = ids_2[_i],
            id = _c.id,
            name_1 = _c.name;
          var visibilityExists = this._getVisibility(map, id);
          !visibilityExists && this._setVisibility(map, id, "visible");
          this._createCheckboxes(
            map,
            id,
            name_1,
            visibilityExists ? this._checkInitialVisibility(map, id) : true,
            false,
            ids,
            i,
          );
        }
      }
    }
  };
  MapboxLayersControl.prototype._init = function (map) {
    var _this = this;
    this._definition.forEach(function (_a, parentIdx) {
      var children = _a.children,
        parentName = _a.name,
        group = _a.group;
      var ids = [];
      children.forEach(function (_a) {
        var _b;
        var id = _a.id,
          name = _a.name;
        ids = __spreadArrays(ids, [{ id: id, name: name }]);
        _this._visibilities = __assign(
          __assign({}, _this._visibilities),
          ((_b = {}),
          (_b[parentIdx] = __assign(__assign({}, _this._visibilities[parentIdx]), {
            active: group ? true : false,
            parentId: parentName || "",
            ids: ids,
          })),
          _b),
        );
      });
    });
    this._splitInfo(map);
  };
  MapboxLayersControl.prototype.onAdd = function (map) {
    this._map = map;
    this._controlContainer = document.createElement("div");
    this._controlContainer.classList.add("mapboxgl-ctrl");
    this._controlContainer.classList.add("mapboxgl-ctrl-group");
    this._layersContainer = document.createElement("div");
    this._layersContainer.classList.add("mapboxgl-ctrl-layers-control");
    if (this._title) {
      var title = document.createElement("span");
      title.classList.add("mapboxgl-ctrl-layers-control__title");
      title.innerHTML = this._title;
      this._layersContainer.appendChild(title);
    }
    this._init(map);
    this._controlContainer.appendChild(this._layersContainer);
    return this._controlContainer;
  };
  MapboxLayersControl.prototype.onRemove = function () {
    if (!this._controlContainer || !this._controlContainer.parentNode || !this._map) {
      return;
    }
    this._controlContainer.parentNode.removeChild(this._controlContainer);
    delete this._map;
  };
  return MapboxLayersControl;
})();
exports.MapboxLayersControl = MapboxLayersControl;
//# sourceMappingURL=index.js.map
