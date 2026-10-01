import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { useEffect } from "react";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import { IconName } from "../Volunteers/icon";
import { useTranslation } from "react-i18next";
import { EntityMarker } from "../common/MapView/types";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";

type Props = {
  setNumOfVols: (num: number) => void;
  markers: EntityMarker[];
};

export function AgentMapView({ markers, setNumOfVols }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);
  const { t } = useTranslation();

  const renderPopupContent = (marker: EntityMarker) => {
    if ("children" in marker) {
      return marker.children?.map((child) => (
        <PopupLink href={child.link} key={child.title}>
          <PopupCardHeader>{child.title}</PopupCardHeader>
          <CardDetail header={t("dashboard.agents.filters.type.header")} iconName={IconName.ShootingStar}>
            <CardParagraph text={child.type ?? ""} />
          </CardDetail>
          <CardDetail header={t("dashboard.agents.district")} iconName={IconName.MapPin}>
            <CardParagraph text={child.district ?? ""} />
          </CardDetail>
        </PopupLink>
      ));
    }
  };

  useEffect(() => {
    const childrenLength = markers.flatMap((marker) => marker.children);
    setNumOfVols(childrenLength?.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapView
        markers={markers}
        activeMarkerIndex={activeMarkerIndex}
        setActiveMarkerIndex={setActiveMarkerIndex}
        renderPopupContent={renderPopupContent}
      />
    </MapContainer>
  );
}
