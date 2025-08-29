// import {
//   CalendarDotsIcon as CalendarDots,
//   MapPinIcon as MapPin,
//   TranslateIcon as Translate,
// } from "@phosphor-icons/react";
// import { useTranslation } from "react-i18next";
import styled from "styled-components";

// import { OpportunityType } from "need4deed-sdk";
// import { ScreenTypes } from "../../config/types";
// import useScreenType from "../../hooks/useScreenType";
// import { Activities } from "../core/common";
// import { iconNameMap } from "../VolunteeringCategories/icon";
// import { IconName } from "../VolunteeringCategories/types";
// import OpportunityCardDetails, { CardDetail } from "./OpportunityCardDetail";
import { Volunteer } from "./types";
// import { formatAccompanyingDate } from "./utils";
// import { hyphenationStyles } from "../styled/mixins";
import { BaseCard } from "@/components/styled/container";
import { Heading3, Paragraph } from "@/components/styled/text";
import { hyphenationStyles } from "@/components/styled/mixins";
import { HourglassIcon, SparkleIcon } from "@phosphor-icons/react";

const Card = styled(BaseCard)`
  background-color: var(--color-orchid-subtle);
  width: var(--dashboard-volunteers-card-width);
  height: var(--dashboard-volunteers-card-height);
  gap: var(--dashboard-volunteers-card-gap);
  padding: var(--dashboard-volunteers-card-padding);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: var(--color-orchid);
  }
`;

const StatusTagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-status-tags-div-gap);
  margin-top: var(--dashboard-volunteers-card-status-tags-div-margin-top);
`;

const StatusDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-white);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  gap: var(--dashboard-volunteers-card-status-div-gap);
  padding: var(--dashboard-volunteers-card-status-div-padding);
`;

const TagDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-green-200);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  padding: var(--dashboard-volunteers-card-tag-div-padding);
  gap: var(--dashboard-volunteers-card-tag-div-gap);
`;

const LanguagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const LanguageDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const HyphenatedHeading3 = styled(Heading3)`
  ${hyphenationStyles}/* Apply the hyphenation mixin */
`;

interface Props extends React.CSSProperties {
  volunteer: Volunteer;
  // iconName: IconName;
  // vo?: boolean;
  // onClickHandler?: (opportunity: Opportunity) => void;
  // CTAs?: ({ flexDirection, opportunity }: React.CSSProperties & { opportunity: Opportunity }) => React.ReactNode;
}

export function VolunteerCard({
  volunteer,
}: // iconName,
Props) {
  console.log(volunteer);
  // const { t, i18n } = useTranslation();
  // const screenType = useScreenType();

  // const {
  //   title,
  //   languages,
  //   schedule,
  //   locations,
  //   activities,
  //   accompanyingDate,
  //   voInformation,
  //   opportunityType,
  //   accompanyingTranslation,
  //   defaultMainCommunication,
  // } = opportunity;

  // const languagesText = languages.join(", ");

  // const languagesComponent = (
  //   <LanguagesContainer>
  //     {opportunityType === OpportunityType.GENERAL ? (
  //       <LanguageDetailContainer>
  //         <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.mainCommunication")}:</Paragraph>
  //         <Paragraph>{defaultMainCommunication}</Paragraph>
  //       </LanguageDetailContainer>
  //     ) : (
  //       <LanguageDetailContainer>
  //         <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.translationTo")}:</Paragraph>
  //         <Paragraph>{accompanyingTranslation}</Paragraph>
  //       </LanguageDetailContainer>
  //     )}

  //     <LanguageDetailContainer>
  //       <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.residentsSpeak")}:</Paragraph>
  //       <Paragraph>{languagesText}</Paragraph>
  //     </LanguageDetailContainer>
  //   </LanguagesContainer>
  // );

  // const district = locations.join(", ");
  // const scheduleAsStr = (accompanyingDate && formatAccompanyingDate(accompanyingDate)) || schedule || "";

  // const cardDetails: CardDetail[] = [
  //   {
  //     icon: <Translate size={20} color="var(--icon-color)" />,
  //     headerText: t(`homepage.volunteeringOpportunities.languages`),
  //     bodyTextComponent: languagesComponent,
  //   },
  //   {
  //     icon: <CalendarDots size={20} color="var(--icon-color)" />,
  //     headerText: accompanyingDate
  //       ? t(`homepage.volunteeringOpportunities.dateOfAppointment`)
  //       : t(`homepage.volunteeringOpportunities.schedule`),
  //     bodyTextComponent: <Paragraph>{scheduleAsStr}</Paragraph>,
  //   },
  //   {
  //     icon: <MapPin size={20} weight="fill" color="var(--icon-color)" />,
  //     headerText: t(`homepage.volunteeringOpportunities.district`),
  //     bodyTextComponent: <Paragraph>{district}</Paragraph>,
  //   },
  // ];

  return (
    <Card>
      <StatusTagsDiv>
        <StatusDiv>
          <HourglassIcon size={18} color="var(--color-red-500)" />
          <Paragraph fontWeight={600} fontSize="14px" lineheight="20px" color="var(--color-red-500)">
            Pending Review
          </Paragraph>
        </StatusDiv>
        <TagDiv>
          <Paragraph fontWeight={500} fontSize="18px" lineheight="18px" color="var(--color-midnight)">
            NEW
          </Paragraph>
          <SparkleIcon size={18} color="var(--color-midnight)" />
        </TagDiv>
      </StatusTagsDiv>
      {/* <IconDiv>{iconNameMap[iconName]}</IconDiv>
      <HyphenatedHeading3 lang={i18n.language}>{title}</HyphenatedHeading3>
      {vo && <Paragraph>{voInformation}</Paragraph>}
      <Activities activities={activities} />
      <OpportunityCardDetails cardDetails={cardDetails} />
      {CTAs && <CTAs flexDirection={screenType === ScreenTypes.MOBILE ? "column" : "row"} opportunity={opportunity} />} */}
    </Card>
  );
}

export default VolunteerCard;
