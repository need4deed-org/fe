import React from "react";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import { IconName } from "../Volunteers/icon";
import { useTranslation } from "react-i18next";
import { EntityMarker } from "../common/MapView/types";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";

type Props = {
  markers: EntityMarker[];
};

export function AgentMapView({ markers }: Props) {
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

  return (
    <MapContainer>
      <MapView markers={markers} renderPopupContent={renderPopupContent} />
    </MapContainer>
  );
}
