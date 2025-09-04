import styled from "styled-components";

import { Volunteer } from "./types";
import { BaseCard } from "@/components/styled/container";
import { Paragraph } from "@/components/styled/text";
import { CheckIcon, HourglassIcon, SparkleIcon } from "@phosphor-icons/react";
import { CirclePic } from "@/components/styled/img";
import { Tags } from "@/components/core/common";
import CardDetail from "./CardDetail";
import { IconName } from "./icon";
import { useTranslation } from "react-i18next";

interface Props extends React.CSSProperties {
  volunteer: Volunteer;
}

export function VolunteerCard({ volunteer }: Props) {
  const { t } = useTranslation();

  const {
    fullName,
    nativeLanguages,
    fluentLanguages,
    intermediateLanguages,
    activities,
    skills,
    preferredBerlinLocations,
  } = volunteer;

  const languages = [
    { level: "Native", list: nativeLanguages.join(", ") },
    { level: "Fluent", list: fluentLanguages.join(", ") },
    { level: "Intermediate", list: intermediateLanguages.join(", ") },
  ];

  return (
    <Card>
      <StatusTagsDiv>
        <StatusDiv>
          <HourglassIcon size={18} color="var(--color-red-500)" />
          <Paragraph
            fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
            fontSize="var(--dashboard-volunteers-card-status-fontSize)"
            lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
            color="var(--color-red-500)"
          >
            Pending Review
          </Paragraph>
        </StatusDiv>
        <TagDiv>
          <Paragraph
            fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
            fontSize="var(--dashboard-volunteers-card-tag-fontSize)"
            lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
          >
            NEW
          </Paragraph>
          <SparkleIcon size={18} color="var(--color-midnight)" />
        </TagDiv>
      </StatusTagsDiv>

      <ProfileDiv>
        <CirclePic src="https://d2nwrdddg8skub.cloudfront.net/images/mohsen.webp" size="64px" />
        <Paragraph
          fontWeight="var(--dashboard-volunteers-card-profile-fontWeight)"
          fontSize="var(--dashboard-volunteers-card-profile-fontSize)"
          lineheight="var(--dashboard-volunteers-card-profile-lineHeight)"
        >
          {fullName}
        </Paragraph>
      </ProfileDiv>

      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        {languages.map(({ level, list }) => (
          <LanguageDetailContainer key={level}>
            <CardParagraph text={`${level}:`} isBold />
            <CardParagraph text={`${list}`} />
          </LanguageDetailContainer>
        ))}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.activities")} iconName={IconName.ShootingStar}>
        <Tags tags={activities} />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.skillsExperience")} iconName={IconName.Wrench}>
        <Tags tags={skills} backgroundColor="var(--color-white)" icon={<CheckIcon size={18} />} />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
        <CardParagraph text="Tuesdays & Thursdays, 9:00-11:00 Occasional Saturdays" />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredDistricts")} iconName={IconName.MapPin}>
        <CardParagraph text={preferredBerlinLocations.join(", ")} />
      </CardDetail>
    </Card>
  );
}

export default VolunteerCard;

/*  Helper components */
interface CardParagraphProps {
  text: string;
  isBold?: boolean;
}

export const CardParagraph = ({ text, isBold }: CardParagraphProps) => (
  <Paragraph
    fontWeight={`var(--dashboard-volunteers-card-paragraph-fontWeight${isBold ? "-bold" : ""})`}
    fontSize="var(--dashboard-volunteers-card-paragraph-fontSize)"
    lineheight="var(--dashboard-volunteers-card-paragraph-lineHeight)"
  >
    {text}
  </Paragraph>
);

/*  Styles */

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

const ProfileDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-volunteers-card-profile-div-gap);
`;

const LanguageDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;
