import { Heading4, Paragraph } from "@/components/styled/text";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createStatusLabelMap } from "./mockVols/tempUtils";
import { CirclePic } from "@/components/styled/img";
import { getImageUrl } from "@/utils";
import { defaultAvatarURL } from "@/config/constants";
import { VolunteerDetail } from "./VolunteerDetail";
import { ProfileStatusBadge } from "../ProfileHeader/common";
import { createEngagementStatusLabelMap } from "./mockVols/tempUtils";
import {
  AccordionContainer,
  HeaderButtonsContainer,
  HeaderContainer,
  HeaderInfoAvatarNameContainer,
  HeaderInfoContainer,
} from "./styles";

interface Props {
  volunteer: ApiVolunteerGetList;
}

export const AccordionVolunteer = ({ volunteer }: Props) => {
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
};
