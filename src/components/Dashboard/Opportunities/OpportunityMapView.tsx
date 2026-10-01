import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { useEffect } from "react";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { useTranslation } from "react-i18next";
import { IconName } from "../Volunteers/icon";
import { EntityMarker, SingleMarker } from "../common/MapView/types";

type Props = {
  setNumOfOpps: (num: number) => void;
  markers: EntityMarker[];
  volunteerMarker: SingleMarker | null;
};

export function OpportunityMapView({ markers, setNumOfOpps, volunteerMarker }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);

  const { t } = useTranslation();

  const renderSinglePopupContent = (marker: SingleMarker) => (
    <PopupLink href={marker.link} key={marker.title}>
      <PopupCardHeader>{marker.title}</PopupCardHeader>
      <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
        <CardParagraph text={marker.availability} />
      </CardDetail>
      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        <CardParagraph text={marker.language} />
      </CardDetail>
    </PopupLink>
  );

  const renderPopupContent = (marker: EntityMarker) => {
    if ("children" in marker) {
      return marker.children?.map((child) => (
        <PopupLink href={child.link} key={child.title}>
          <PopupCardHeader>{child.title}</PopupCardHeader>
          <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
            <CardParagraph text={child.availability ?? ""} />
          </CardDetail>
          <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
            <CardParagraph text={child.language ?? ""} />
          </CardDetail>
        </PopupLink>
      ));
    }
  };
  console.log("vol", volunteerMarker);
  useEffect(() => {
    const childrenMarkers = markers.flatMap((marker) => marker.children);
    setNumOfOpps(childrenMarkers.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapView
        markers={markers}
        activeMarkerIndex={activeMarkerIndex}
        setActiveMarkerIndex={setActiveMarkerIndex}
        renderPopupContent={renderPopupContent}
        renderSinglePopupContent={renderSinglePopupContent}
        filterMarker={volunteerMarker}
      />
    </MapContainer>
  );
}
