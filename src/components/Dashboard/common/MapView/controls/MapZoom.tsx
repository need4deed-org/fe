import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapZoom = ({ zoom }: { zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setZoom(zoom);
  }, [map, zoom]);

  return null;
};
