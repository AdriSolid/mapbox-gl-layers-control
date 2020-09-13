# @mapbox-gl/layers-control

> Mapbox GL JS Layers Control

---

<img src="./thumb.png" alt="thumb">

### Features

- Create a layers control by wrapping Mapbox GL JS layers id's.
- Layers could be grouped. If all layers of a group are `visible` 'select all' checkbox will be checked, otherwise, will be unchecked.
- Visibility is firstly controled under `visibility` layout property, if this property does not exists, Mapbox GL JS assumes that is `visible`.

### Getting Started

```bash
yarn add @mapbox-gl-style-switcher
```

### Usage:

```js
import { MapboxLayersControl } from "@mapbox-gl/layers-control";
import { Map } from "mapbox-gl";
import "@mapbox-gl/layers-control/styles.css";

const map = new Map();
map.addControl(
  new MapboxLayersControl({
    title: "Floors",
    layersDefinition: [
      // This is grouped
      {
        name: "Floors",
        group: true,
        children: [
          {
            id: "buildings-1",
            name: "First floor",
          },
          {
            id: "buildings-2",
            name: "Second floor",
          },
          {
            id: "buildings-3",
            name: "Third floor",
          },
        ],
      },
      // This is not grouped
      {
        group: false,
        children: [
          {
            id: "buildings-4",
            name: "Fourth floor",
          },
          {
            id: "buildings-5",
            name: "Fifth floor",
          },
          {
            id: "buildings-6",
            name: "Sixth floor",
          },
        ],
      },
    ],
  }),
);
```

### Properties:

- **title** (Default: `""`): `string` Layers control title
- **layersDefinition** (Default: `{}`): `LayersDefinition` Layers control definition. Following these types:

  ```ts
  type LayersInfo = Array<{ id: string; name: string }>;
  type LayersDefinition = Array<{ children: LayersInfo; group?: boolean; name?: string }>;
  ```
