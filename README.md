# @adrisolid/mapbox-gl-layers-control

> Mapbox GL JS Layers Control

---

<h4>I need some caffeine to work :)</h4>
<a href='https://ko-fi.com/R6R01NRMJ' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

<img src="./thumb.png" alt="thumb">

### Features

- Create a layers control by wrapping Mapbox GL JS layers id's.
- Layers could be grouped. If all layers of a group are `visible` 'select all' checkbox will be checked, otherwise, will be unchecked.
- Visibility is firstly controled under `visibility` layout property, if this property does not exists, Mapbox GL JS assumes that is `visible`.

### Getting Started

```bash
yarn add @adrisolid/mapbox-gl-layers-control
```

### Usage with Vanilla JS:

```js
import { Map } from "mapbox-gl";
import { MapboxLayersControl } from "@adrisolid/mapbox-gl-layers-control";
import "@adrisolid/mapbox-gl-layers-control/styles.css";

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

### Usage with React

[Check this out :)](https://github.com/AdriSolid/mapbox-gl-layers-control/tree/master/examples/with-react)

### Properties:

- **title** (Default: `""`): `string` Layers control title
- **layersDefinition** (Default: `{}`): `LayersDefinition` Layers control definition. Following these types:

  ```ts
  type LayersInfo = Array<{ id: string; name: string }>;
  type LayersDefinition = Array<{ children: LayersInfo; group?: boolean; name?: string }>;
  ```
