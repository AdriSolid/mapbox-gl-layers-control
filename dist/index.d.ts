import { IControl, Map } from "mapbox-gl";
import { LayersDefinition, Options } from "./types";
export declare class MapboxLayersControl implements IControl {
    private _definition;
    private _controlContainer;
    private _groupContainer;
    private _layersContainer;
    private _map;
    private _parentsIds;
    private _title;
    private _visibilities;
    constructor({ layersDefinition, title }: Options);
    get layersDefinition(): LayersDefinition;
    getDefaultPosition(): string;
    private _getVisibility;
    private _setVisibility;
    private _checkInitialVisibility;
    private _checkAllVisible;
    private _checkAllChecked;
    private _setParentsChecks;
    private _setChildrenChecks;
    private _idGenerator;
    private _createCheckboxes;
    private _splitInfo;
    private _init;
    onAdd(map: Map): HTMLElement;
    onRemove(): void;
}
