export declare type LayersInfo = Array<{
    id: string;
    name: string;
}>;
export declare type LayersDefinition = Array<{
    children: LayersInfo;
    group?: boolean;
    name: string;
}>;
export declare type Options = {
    layersDefinition: LayersDefinition;
    title: string;
};
export declare type ParentsIds = {
    [idx: string]: string;
};
export declare type Visibilities = {
    active: boolean;
    ids: Array<{
        id: string;
        name: string;
    }>;
    parentId: string;
};
