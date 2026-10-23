import { GeoJSON, Pane, Polygon } from "react-leaflet";
import { ApiDistrictGeometryCollection } from "need4deed-sdk";
import { useRef } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import { districtFillColors, MAP_AREA_RING } from "./helpers";

interface Props {
  districtGeometries: ApiDistrictGeometryCollection;
}

export const DistrictPolygons = ({ districtGeometries }: Props) => {
  const map = useMap();
  const districtLayers = useRef<Array<{ layer: L.Path; fillColor: string; title?: string }>>([]);
  const selectedDistrict = useRef<L.Path | null>(null);
  const hoveredDistrict = useRef<L.Path | null>(null);

  const districtMaskHoles: L.LatLngExpression[][] =
    districtGeometries?.features.flatMap(({ geometry }) => {
      const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

      return polygons.flatMap((rings) => {
        const outerRing = rings[0];
        return outerRing ? [outerRing.map(([longitude, latitude]) => [latitude, longitude] as L.LatLngTuple)] : [];
      });
    }) ?? [];

  const getDistrictFillColor = (title: unknown) =>
    typeof title === "string" ? districtFillColors[title] : districtFillColors.Mitte;

  const updateDistrictStyles = (activeDistrict: L.Path | null) => {
    districtLayers.current.forEach(({ layer, fillColor }) => {
      layer.setStyle({ fillColor: activeDistrict && layer !== activeDistrict ? "var(color-black)" : fillColor });
    });
  };

  useMapEvent("click", () => {
    const previousDistrict = selectedDistrict.current;
    if (previousDistrict) {
      const district = districtLayers.current.find(({ layer }) => layer === previousDistrict);
      previousDistrict.unbindTooltip();
      if (district?.title) previousDistrict.bindTooltip(district.title);
    }
    selectedDistrict.current = null;
    hoveredDistrict.current = null;
    updateDistrictStyles(null);
  });

  return (
    <>
      <Pane name="district-background" style={{ zIndex: 300 }}>
        <Polygon
          positions={[MAP_AREA_RING, ...districtMaskHoles]}
          pathOptions={{
            fillColor: "var(--color-orchid-light)",
            fillOpacity: 1,
            fillRule: "evenodd",
            stroke: false,
          }}
        />
      </Pane>
      <GeoJSON
        style={(feature) => {
          return {
            fillColor: getDistrictFillColor(feature?.properties?.title),
            color: "black",
            weight: 2,
          };
        }}
        data={districtGeometries}
        onEachFeature={(feature, layer) => {
          const title = feature.properties?.title;
          if (title) layer.bindTooltip(title);
          if (layer instanceof L.Path) {
            const fillColor = getDistrictFillColor(title);
            districtLayers.current.push({ layer, fillColor, title });
            layer.options.bubblingMouseEvents = false;
            layer.on("mouseover", () => {
              hoveredDistrict.current = layer;
              updateDistrictStyles(selectedDistrict.current ?? layer);
            });
            layer.on("mouseout", () => {
              if (hoveredDistrict.current === layer) hoveredDistrict.current = null;
              updateDistrictStyles(selectedDistrict.current ?? hoveredDistrict.current);
            });
          }
          layer.on("click", (event) => {
            if (layer instanceof L.Path) {
              const previousDistrict = selectedDistrict.current;
              if (previousDistrict && previousDistrict !== layer) {
                const previous = districtLayers.current.find(
                  ({ layer: districtLayer }) => districtLayer === previousDistrict,
                );
                previousDistrict.unbindTooltip();
                if (previous?.title) previousDistrict.bindTooltip(previous.title);
              }

              selectedDistrict.current = layer;
              hoveredDistrict.current = layer;
              updateDistrictStyles(layer);
              if (title) {
                layer.unbindTooltip();
                layer.bindTooltip(title, { permanent: true, direction: "center" }).openTooltip();
              }
            }
            map.setView(event.latlng, 12, { animate: true });
          });
        }}
      />
    </>
  );
};
