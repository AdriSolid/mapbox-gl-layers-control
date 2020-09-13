import { useContext, useEffect } from "react";
import { MapContext } from "react-mapbox-gl";
import { MapboxLayersControl } from "@adrisolid/mapbox-gl-layers-control";
import "@adrisolid/mapbox-gl-layers-control/styles.css";

function LayersControl() {
  const map = useContext(MapContext);

  useEffect(() => {
    if (map) {
      map.addControl(
        new MapboxLayersControl({
          title: "Floors",
          layersDefinition: [
            {
              name: "Select all",
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
          ],
        }),
      );
    }
  }, [map]);

  return null;
}

export default LayersControl;
