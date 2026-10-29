import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapZoom = ({ zoom }: { zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setMinZoom(9);
    map.setZoom(zoom);
  }, [map, zoom]);

  return null;
};
