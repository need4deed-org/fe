import { GeoJSON, Pane, Polygon } from "react-leaflet";
import { ApiDistrictGeometryCollection } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMapEvent } from "react-leaflet";
import L from "leaflet";
import { districtFillColors, MAP_AREA_RING, resolveCssColor } from "../helpers";

interface Props {
  districtGeometries: ApiDistrictGeometryCollection;
  onDistrictClick: (title: string) => void;
  selectedDistrictTitles: string[];
}

export const DistrictPolygons = ({ districtGeometries, onDistrictClick, selectedDistrictTitles }: Props) => {
  const districtLayers = useRef<Array<{ layer: L.Path; fillColor: string; title?: string }>>([]);
  const districtGeometriesRef = useRef(districtGeometries);
  const selectedDistrictTitleSet = useRef(new Set(selectedDistrictTitles));
  const hoveredDistrict = useRef<L.Path | null>(null);
  const onDistrictClickRef = useRef(onDistrictClick);
  onDistrictClickRef.current = onDistrictClick;

  const districtMaskHoles: L.LatLngExpression[][] = useMemo(
    () =>
      districtGeometries.features.flatMap(({ geometry }) => {
        const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

        return polygons.flatMap((rings) => {
          const outerRing = rings[0];
          return outerRing ? [outerRing.map(([longitude, latitude]) => [latitude, longitude] as L.LatLngTuple)] : [];
        });
      }),
    [districtGeometries],
  );

  const resolvedDistrictFillColors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(districtFillColors).map(([title, color]) => [title, resolveCssColor(color)]),
      ) as Record<string, string>,
    [],
  );
  const defaultDistrictFillColor = resolvedDistrictFillColors.Mitte;
  const inactiveDistrictFillColor = resolveCssColor("var(--color-black)");

  const getDistrictFillColor = useCallback(
    (title: unknown) =>
      typeof title === "string"
        ? (resolvedDistrictFillColors[title] ?? defaultDistrictFillColor)
        : defaultDistrictFillColor,
    [defaultDistrictFillColor, resolvedDistrictFillColors],
  );
  const getDistrictStyle = useCallback<L.StyleFunction>(
    (feature) => ({
      fillColor: getDistrictFillColor(feature?.properties?.title),
      color: inactiveDistrictFillColor,
      weight: 2,
    }),
    [getDistrictFillColor, inactiveDistrictFillColor],
  );

  const updateDistrictStyles = useCallback(() => {
    const selectedTitles = selectedDistrictTitleSet.current;
    const hoveredLayer = hoveredDistrict.current;
    districtLayers.current.forEach(({ layer, fillColor, title }) => {
      const isSelected = title !== undefined && selectedTitles.has(title);
      const isHovered = layer === hoveredLayer;
      const hasActiveDistricts = selectedTitles.size > 0 || hoveredLayer !== null;
      layer.setStyle({
        fillColor: hasActiveDistricts && !isSelected && !isHovered ? inactiveDistrictFillColor : fillColor,
      });
    });
  }, [inactiveDistrictFillColor]);

  useEffect(() => {
    selectedDistrictTitleSet.current = new Set(selectedDistrictTitles);
    hoveredDistrict.current = null;
    districtLayers.current.forEach(({ layer, title }) => {
      layer.unbindTooltip();
      if (title) {
        const isSelected = selectedDistrictTitleSet.current.has(title);
        layer.bindTooltip(title, isSelected ? { permanent: true, direction: "center" } : undefined);
        if (isSelected) layer.openTooltip();
      }
    });
    updateDistrictStyles();
  }, [selectedDistrictTitles, updateDistrictStyles]);

  useMapEvent("click", () => {
    hoveredDistrict.current = null;
    updateDistrictStyles();
  });

  return (
    <>
      <Pane name="district-background" style={{ zIndex: 300 }}>
        <Polygon positions={[MAP_AREA_RING, ...districtMaskHoles]} />
      </Pane>
      <GeoJSON
        style={getDistrictStyle}
        data={districtGeometries}
        onEachFeature={(feature, layer) => {
          if (districtGeometriesRef.current !== districtGeometries) {
            districtLayers.current = [];
            hoveredDistrict.current = null;
            districtGeometriesRef.current = districtGeometries;
          }
          const title = feature.properties?.title;
          if (title) {
            const isSelected = selectedDistrictTitleSet.current.has(title);
            layer.bindTooltip(title, isSelected ? { permanent: true, direction: "center" } : undefined);
            if (isSelected) layer.openTooltip();
          }
          if (layer instanceof L.Path) {
            const fillColor = getDistrictFillColor(title);
            districtLayers.current.push({ layer, fillColor, title });
            updateDistrictStyles();
            layer.options.bubblingMouseEvents = false;
            layer.on("mouseover", () => {
              hoveredDistrict.current = layer;
              updateDistrictStyles();
            });
            layer.on("mouseout", () => {
              if (hoveredDistrict.current === layer) hoveredDistrict.current = null;
              updateDistrictStyles();
            });
          }
          layer.on("click", () => {
            if (layer instanceof L.Path) {
              hoveredDistrict.current = null;
              updateDistrictStyles();
              if (title) onDistrictClickRef.current(title);
            }
          });
        }}
      />
    </>
  );
};
