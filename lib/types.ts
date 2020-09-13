export type LayersInfo = Array<{ id: string; name: string }>;

export type LayersDefinition = Array<{ children: LayersInfo; group?: boolean; name: string }>;

export type Options = {
  layersDefinition: LayersDefinition;
  title: string;
};

export type ParentsIds = { [idx: string]: string };

export type Visibilities = {
  active: boolean;
  ids: Array<{ id: string; name: string }>;
  parentId: string;
};
