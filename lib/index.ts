import { IControl, Map } from "mapbox-gl";
import { LayersInfo, LayersDefinition, Options, ParentsIds, Visibilities } from "./types";

const DEFAULT_POSITION = "top-right";

export class MapboxLayersControl implements IControl {
  private _definition: LayersDefinition;
  private _controlContainer: HTMLElement | undefined;
  private _groupContainer: HTMLElement | undefined;
  private _layersContainer: HTMLElement | undefined;
  private _map: Map;
  private _parentsIds: ParentsIds = {};
  private _title: string;
  private _visibilities: Visibilities = {
    active: false,
    parentId: "",
    ids: [
      {
        id: "",
        name: "",
      },
    ],
  };

  constructor({ layersDefinition, title = "" }: Options) {
    this._definition = layersDefinition;
    this._title = title;
  }

  public get layersDefinition(): LayersDefinition {
    return this._definition;
  }

  public getDefaultPosition(): string {
    return DEFAULT_POSITION;
  }

  private _getVisibility(map: Map, id: string): string | undefined {
    return map.getLayoutProperty(id, "visibility");
  }

  private _setVisibility(map: Map, id: string, value: "visible" | "none"): void {
    map.setLayoutProperty(id, "visibility", value);
  }

  private _checkInitialVisibility(map: Map, id: string): boolean {
    if (this._getVisibility(map, id) === "visible") {
      return true;
    }

    return false;
  }

  private _checkAllVisible(map: Map, ids: LayersInfo): boolean {
    let allAreVisible = true;

    for (const { id } of ids) {
      if (this._getVisibility(map, id) === "none") {
        allAreVisible = false;
        break;
      }
    }

    return allAreVisible;
  }

  private _checkAllChecked(data: LayersInfo): boolean {
    let allChecked = true;
    for (const { id } of data) {
      const childNode = document.querySelector(`#${id}`) as HTMLInputElement;

      if (!childNode.checked) {
        allChecked = false;
        break;
      }
    }

    return allChecked;
  }

  private _setParentsChecks(map: Map, data: LayersInfo, parentId: string, checked: boolean): void {
    const parentNode = document.querySelector(`#${parentId}`) as HTMLInputElement;
    parentNode.checked = checked;

    for (const { id } of data) {
      const node = document.querySelector(`#${id}`) as HTMLInputElement;

      this._setVisibility(map, id, checked ? "visible" : "none");
      node.checked = checked;
    }
  }

  private _setChildrenChecks(map: Map, id: string, checked: boolean, data: LayersInfo, parentId: string): void {
    const node = document.querySelector(`#${id}`) as HTMLInputElement;

    if (!checked) {
      this._setVisibility(map, id, "none");
      node.checked = false;
    } else {
      this._setVisibility(map, id, "visible");
      node.checked = true;
    }

    const parentNode = document.querySelector(`#${parentId}`) as HTMLInputElement;
    parentNode.checked = this._checkAllChecked(data);
  }

  private _idGenerator(): string {
    return `parent-id-${Math.random().toString(36).substr(2, 9)}`;
  }

  private _createCheckboxes(
    map: Map,
    id: string,
    name: string,
    active: boolean,
    isParent: boolean,
    data: LayersInfo,
    parentsIdsIdx: string,
  ) {
    const layerContainer = document.createElement("div");
    layerContainer.classList.add(`mapboxgl-ctrl-layers-control__${isParent ? "all" : "layer"}-container`);

    if (isParent && !active) {
      layerContainer.style.display = "none";
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.name = id;
    input.checked = isParent ? this._checkAllVisible(map, data) : active;

    input.addEventListener("click", (e: Event) => {
      const { checked, id, name } = e.target as HTMLInputElement;

      const hasParent = name.includes("parent");

      hasParent
        ? this._setParentsChecks(map, data, id, checked)
        : this._setChildrenChecks(map, id, checked, data, this._parentsIds[parentsIdsIdx]);
    });

    input.classList.add("mapboxgl-ctrl-layers-control__checkbox");

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = name;

    layerContainer.appendChild(input);
    layerContainer.appendChild(label);

    if (this._groupContainer) {
      this._groupContainer?.appendChild(layerContainer);
      this._layersContainer?.appendChild(this._groupContainer);
    }
  }

  private _splitInfo(map: Map): void {
    const parents: any = Object.values(this._visibilities);

    for (const i in parents) {
      if (typeof parents[i] === "object" && !Array.isArray(parents[i])) {
        const { active, ids, parentId } = parents[i];

        this._parentsIds = {
          ...this._parentsIds,
          [i]: this._idGenerator(),
        };

        this._groupContainer = document.createElement("div");
        this._groupContainer.id = `group-${this._parentsIds[i]}`;
        this._groupContainer.classList.add("mapboxgl-ctrl-layers-control__group-container");

        this._createCheckboxes(map, this._parentsIds[i], parentId, active, true, ids, "");

        for (const { id, name } of ids) {
          const visibilityExists = this._getVisibility(map, id);
          !visibilityExists && this._setVisibility(map, id, "visible");

          this._createCheckboxes(
            map,
            id,
            name,
            visibilityExists ? this._checkInitialVisibility(map, id) : true,
            false,
            ids,
            i,
          );
        }
      }
    }
  }

  private _init(map: Map): void {
    this._definition.forEach(({ children, name: parentName, group }, parentIdx) => {
      let ids: LayersInfo = [];

      children.forEach(({ id, name }) => {
        ids = [...ids, { id, name }];

        this._visibilities = {
          ...this._visibilities,
          [parentIdx]: {
            ...this._visibilities[parentIdx],
            active: group ? true : false,
            parentId: parentName || "",
            ids,
          },
        };
      });
    });

    this._splitInfo(map);
  }

  public onAdd(map: Map): HTMLElement {
    this._map = map;

    this._controlContainer = document.createElement("div");
    this._controlContainer.classList.add("mapboxgl-ctrl");
    this._controlContainer.classList.add("mapboxgl-ctrl-group");

    this._layersContainer = document.createElement("div");
    this._layersContainer.classList.add("mapboxgl-ctrl-layers-control");

    if (this._title) {
      const title = document.createElement("span");
      title.classList.add("mapboxgl-ctrl-layers-control__title");
      title.innerHTML = this._title;

      this._layersContainer.appendChild(title);
    }

    this._init(map);

    this._controlContainer.appendChild(this._layersContainer);

    return this._controlContainer;
  }

  public onRemove(): void {
    if (!this._controlContainer || !this._controlContainer.parentNode || !this._map) {
      return;
    }

    this._controlContainer.parentNode.removeChild(this._controlContainer);

    delete this._map;
  }
}
