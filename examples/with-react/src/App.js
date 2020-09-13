import React from "react";
import ReactMapboxGl, { Layer } from "react-mapbox-gl";
import LayersControl from "./LayersControl";

const LAYERS_INFO = [
  {
    id: "buildings-1",
    color: "red",
    xtrsnH: ["/", ["get", "height"], 2],
    xtrsB: ["get", "min_height"],
  },
  {
    id: "buildings-2",
    color: "orange",
    xtrsnH: ["get", "height"],
    xtrsB: ["/", ["get", "height"], 2],
  },
  {
    id: "buildings-3",
    color: "lightblue",
    xtrsnH: ["*", ["get", "height"], 1.5],
    xtrsB: ["get", "height"],
  },
];

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidmljbWl0Y2giLCJhIjoiY2swcGVwemN0MGt1ajNicGt3Z2UwbjN2OCJ9.Q0K2RBp8n9LBipcm3edDRQ",
  antialias: true,
});

function App() {
  function addControl(layers) {
    return layers.map(({ id, color, xtrsnH, xtrsB }) => (
      <Layer
        id={id}
        type="fill-extrusion"
        sourceId="composite"
        sourceLayer="building"
        filter={["==", "extrude", "true"]}
        minZoom={15}
        paint={{
          "fill-extrusion-color": color,
          "fill-extrusion-height": xtrsnH,
          "fill-extrusion-base": xtrsB,
          "fill-extrusion-opacity": 0.6,
        }}
      ></Layer>
    ));
  }

  return (
    <Map
      style="mapbox://styles/mapbox/dark-v10"
      center={[-74.0066, 40.7135]}
      zoom={[15.5]}
      pitch={[45]}
      bearing={[-17.6]}
      containerStyle={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {addControl(LAYERS_INFO)}
      <LayersControl />
    </Map>
  );
}

export default App;
