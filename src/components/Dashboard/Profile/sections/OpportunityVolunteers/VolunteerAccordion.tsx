import { Heading4, Paragraph } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusBadge from "../../common/StatusBadge";
import { MockOpportunityVolunteer } from "./mockVolunteers";
import {
  AccordionContainer,
  AvatarImg,
  HeaderButtonsContainer,
  HeaderContainer,
  HeaderInfoAvatarNameContainer,
  HeaderInfoContainer,
} from "./styles";

type Props = {
  volunteer: MockOpportunityVolunteer;
};

export const VolunteerAccordion = ({ volunteer }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id, name, avatarUrl, engagementStatus, volunteerType, appliedAt } = volunteer;

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/volunteers/${id}`);
  };
  const CaretIcon = isOpen ? CaretUpIcon : CaretDownIcon;
  const resolvedAvatarUrl = getImageUrl(avatarUrl || defaultAvatarVolunteerProfile);

  return (
    <AccordionContainer data-testid="volunteer-accordion">
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderInfoAvatarNameContainer>
            <AvatarImg src={resolvedAvatarUrl} alt={name} />
            <Heading4 margin={0} color="var(--color-midnight)">
              {name}
            </Heading4>
            <StatusBadge status={engagementStatus} />
            <StatusBadge status={volunteerType} />
          </HeaderInfoAvatarNameContainer>
          <Paragraph>{`${t("dashboard.opportunityProfile.volunteersSec.appliedOn")} ${appliedAt}`}</Paragraph>
        </HeaderInfoContainer>

        <HeaderButtonsContainer>
          <Heading4
            margin={0}
            color="var(--color-midnight-light)"
            onClick={handleGoToProfile}
            style={{ cursor: "pointer" }}
          >
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
    </AccordionContainer>
  );
};
