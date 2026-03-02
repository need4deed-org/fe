import { Heading4, Paragraph } from "@/components/styled/text";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createStatusLabelMap } from "./mockOpps/tempUtils";
import { CirclePic } from "@/components/styled/img";
import { getImageUrl } from "@/utils";
import { defaultAvatarURL } from "@/config/constants";
import VolunteerDetail from "./VolunteerDetail";
import { ProfileStatusBadge } from "../ProfileHeader/common";
import { createEngagementStatusLabelMap } from "./mockOpps/tempUtils";

interface Props {
  volunteer: ApiVolunteerGetList;
}

export default function AccordionVolunteer({ volunteer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const CaretIcon = isOpen ? CaretUpIcon : CaretDownIcon;

  const engagementStatusLabels = createEngagementStatusLabelMap(t);

  const statusLabels = createStatusLabelMap(t);
  return (
    <AccordionContainer>
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderInfoAvatarNameContainer>
            <CirclePic src={getImageUrl(volunteer?.avatarUrl || defaultAvatarURL)} size="40px" />
            <Heading4 margin={0} color="var(--color-midnight)">
              {volunteer?.name}
            </Heading4>
            {/* Todo: this will be updated later when vol fetched from API */}
            <ProfileStatusBadge
              status={volunteer?.statusEngagement}
              label={engagementStatusLabels[volunteer?.statusEngagement]}
            />
            <ProfileStatusBadge status={volunteer?.statusType} label={statusLabels[volunteer?.statusType]} />
          </HeaderInfoAvatarNameContainer>
          {/* Todo: this will be updated later when vol fetched from API */}
          <Paragraph>Applied on 12.02.2025</Paragraph>
        </HeaderInfoContainer>

        <HeaderButtonsContainer>
          <Heading4 margin={0} color="var(--color-midnight-light)">
            {t("dashboard.opportunities.goToProfile")}
          </Heading4>
          <CaretIcon
            size={24}
            onClick={() => setIsOpen((prev) => !prev)}
            cursor="pointer"
            color="var(--color-midnight)"
          />
        </HeaderButtonsContainer>
      </HeaderContainer>

      {isOpen && <VolunteerDetail volunteer={volunteer} />}
    </AccordionContainer>
  );
}

/* Styles */

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
  padding: var(--volunteer-profile-opportunities-accordion-container-padding);
  border-radius: var(--volunteer-profile-opportunities-accordion-container-border-radius);
  border: var(--volunteer-profile-opportunities-accordion-container-border);
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const HeaderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--volunteer-profile-opportunities-accordion-header-info-gap);
`;

const HeaderInfoAvatarNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-avatar-name-gap);
  align-self: stretch;
`;

const HeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-buttons-gap);
`;
