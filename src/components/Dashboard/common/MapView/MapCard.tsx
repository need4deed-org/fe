import "./map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BERLIN_BOUNDS, DEFAULT_CENTER } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import L from "leaflet";
import BerlinRacs from "./BerlinRacs";
import { MapLegendControl } from "./MapLegend";
import { MapScroll } from "./MapScroll";
import { EntityMarker, EntityType, SingleMarker } from "./types";
import { MapOtherRacs } from "./MapOtherRacs";
import { useGetDistrictGeometry } from "@/hooks/useGetDistrictGeometry";
import { DistrictPolygons } from "./DistrictPolygons";
import { questionMark, ScreenTypes } from "@/config/constants";
import { QueryParamsKeys } from "need4deed-sdk";
import { useScreenType } from "@/context/DeviceContext";

interface Props {
  markers?: EntityMarker[];
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (filter: SingleMarker) => React.ReactNode;
}

const MapCard = ({ markers, renderPopupContent, filterMarker, renderSinglePopupContent }: Props) => {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  const [showOtherRacs, setShowOtherRacs] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const screenSize = useScreenType();
  const isMobile = screenSize === ScreenTypes.MOBILE;
  const selectedDistrictTitles = useMemo(() => searchParams.getAll(QueryParamsKeys.DISTRICT), [searchParams]);
  const selectedDistrictTitlesRef = useRef(selectedDistrictTitles);

  selectedDistrictTitlesRef.current = selectedDistrictTitles;

  const { data: districtGeometries } = useGetDistrictGeometry();

  const handleDistrictClick = (title: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedTitles = selectedDistrictTitlesRef.current;
    const nextSelectedTitles = selectedTitles.includes(title)
      ? selectedTitles.filter((selectedTitle) => selectedTitle !== title)
      : [...selectedTitles, title];

    selectedDistrictTitlesRef.current = nextSelectedTitles;
    params.delete("page");
    params.delete(QueryParamsKeys.DISTRICT);
    nextSelectedTitles.forEach((selectedTitle) => params.append(QueryParamsKeys.DISTRICT, selectedTitle));
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const generateCustomIcon = (url: string, count?: number, entity?: EntityType) => {
    if (entity === EntityType.OPPORTUNITY) return new L.Icon.Default({ className: "need4deed-icon" });
    if (entity === EntityType.VOLUNTEER)
      return L.icon({
        iconUrl: url,
        iconAnchor: [15, 15],
        className: "custom-avatar-icon",
      });
    return L.divIcon({
      iconAnchor: [35, 5],
      className: "custom-icon",
      html: `<div>${count}</div>`,
    });
  };

  return (
    <StyledMapContainer>
      <MapContainer
        center={DEFAULT_CENTER}
        minZoom={isMobile ? 9 : 11}
        zoom={isMobile ? 9 : 11}
        maxBounds={BERLIN_BOUNDS}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!isMobile && <MapLegendControl />}
        {!isMobile && <MapScroll enableScroll={enableScroll} setEnabledScroll={setEnableScroll} />}
        {!isMobile && <MapOtherRacs showOtherRacs={showOtherRacs} setShowOtherRacs={setShowOtherRacs} />}
        {districtGeometries && (
          <DistrictPolygons
            districtGeometries={districtGeometries}
            onDistrictClick={handleDistrictClick}
            selectedDistrictTitles={selectedDistrictTitles}
          />
        )}
        {showOtherRacs && <BerlinRacs />}
        {filterMarker && (
          <Marker
            position={[filterMarker.lat, filterMarker.lon]}
            icon={generateCustomIcon(filterMarker.avatarUrl ?? "", 0, filterMarker.entity)}
            zIndexOffset={200}
          >
            <Popup>{renderSinglePopupContent?.(filterMarker)}</Popup>
          </Marker>
        )}
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            icon={generateCustomIcon(marker?.avatarUrl ?? "", marker.children?.length)}
            zIndexOffset={100}
          >
            <Popup>
              <PopupContentWrapper>
                <PopupHeader>{marker.label}</PopupHeader>
                {renderPopupContent(marker)}
              </PopupContentWrapper>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </StyledMapContainer>
  );
};

export default MapCard;
