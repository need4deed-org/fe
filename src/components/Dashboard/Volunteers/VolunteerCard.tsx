import styled from "styled-components";

import { Tags } from "@/components/core/common";
import { BaseCard } from "@/components/styled/container";
import { CirclePic } from "@/components/styled/img";
import { Paragraph } from "@/components/styled/text";
import { defaultAvatarURL } from "@/config/constants";
import { capitalizeFirstLetter, getImageUrl } from "@/utils";
import { CheckIcon, FlagIcon, HourglassIcon, LinkIcon, SealCheckIcon, SparkleIcon } from "@phosphor-icons/react";
import { ApiVolunteerGetList, VolunteerStateType } from "need4deed-sdk";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import CardDetail from "./CardDetail";
import { groupLanguagesByProficiency } from "./helpers";
import { IconName } from "./icon";

interface Props {
  volunteer: ApiVolunteerGetList;
}

export function VolunteerCard({ volunteer }: Props) {
  const { t } = useTranslation();

  const { name, languages, activities, skills, locations, availability, avatarUrl, status } = volunteer;

  const groupedLanguages = groupLanguagesByProficiency(languages);

  const availabilities = availability.map((a) => capitalizeFirstLetter(a.day) + ", " + a.daytime.join("-"));

  return (
    <Card>
      <StatusTagsDiv>
        <StatusDiv>
          {statusIconMap[status]}

          <Paragraph
            fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
            fontSize="var(--dashboard-volunteers-card-status-fontSize)"
            lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
            color={statusColorMap[status]}
          >
            {status}
          </Paragraph>
        </StatusDiv>

        {status === VolunteerStateType.NEW && (
          <TagDiv>
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-tag-fontSize)"
              lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
            >
              {status}
            </Paragraph>
            <SparkleIcon size={18} color="var(--color-midnight)" />
          </TagDiv>
        )}
      </StatusTagsDiv>

      <ProfileDiv>
        <CirclePic src={getImageUrl(avatarUrl || defaultAvatarURL)} size="64px" />
        <Paragraph
          fontWeight="var(--dashboard-volunteers-card-profile-fontWeight)"
          fontSize="var(--dashboard-volunteers-card-profile-fontSize)"
          lineheight="var(--dashboard-volunteers-card-profile-lineHeight)"
        >
          {name}
        </Paragraph>
      </ProfileDiv>

      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        {groupedLanguages.map(({ proficiency, list }) => (
          <LanguageDetailContainer key={proficiency}>
            <CardParagraph text={`${t(`dashboard.volunteers.langProficiency.${proficiency}`)}:`} isBold />
            <CardParagraph text={`${list.join(", ")}`} />
          </LanguageDetailContainer>
        ))}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.activities")} iconName={IconName.ShootingStar}>
        <Tags tags={activities as unknown as string[]} />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.skillsExperience")} iconName={IconName.Wrench}>
        <Tags
          tags={skills as unknown as string[]}
          backgroundColor="var(--color-white)"
          icon={<CheckIcon size={18} />}
        />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
        {availabilities.map((a) => (
          <LanguageDetailContainer key={a}>
            <CardParagraph text={a} />
          </LanguageDetailContainer>
        ))}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredDistricts")} iconName={IconName.MapPin}>
        <CardParagraph text={locations.join(", ")} />
      </CardDetail>
    </Card>
  );
}

export default VolunteerCard;

/* Helper maps */

// Todo: this map will be updated Later
const statusColorMap: Record<VolunteerStateType, string> = {
  [VolunteerStateType.NEW]: "var(--color-red-500)",
  [VolunteerStateType.MATCHED]: "var(--color-green-700)",
  [VolunteerStateType.OPPORTUNITY_SENT]: "var(--color-red-200)",
  [VolunteerStateType.ACTIVE_REGULAR]: "var(--color-red-200)",
  [VolunteerStateType.ACTIVE_ACCOMPANY]: "var(--color-red-200)",
  [VolunteerStateType.ACTIVE_FEST]: "var(--color-red-200)",
  [VolunteerStateType.TO_REMATCH]: "var(--color-red-200)",
  [VolunteerStateType.TEMP_INACTIVE]: "var(--color-red-200)",
  [VolunteerStateType.INACTIVE]: "var(--color-red-200)",
};

// Todo: this map will be updated Later
const statusIconMap: Record<VolunteerStateType, JSX.Element> = {
  [VolunteerStateType.NEW]: <HourglassIcon size={18} color={statusColorMap[VolunteerStateType.NEW]} />,
  [VolunteerStateType.MATCHED]: <SealCheckIcon size={18} color={statusColorMap[VolunteerStateType.MATCHED]} />,
  [VolunteerStateType.OPPORTUNITY_SENT]: (
    <FlagIcon size={18} color={statusColorMap[VolunteerStateType.OPPORTUNITY_SENT]} />
  ),
  [VolunteerStateType.ACTIVE_REGULAR]: <LinkIcon size={18} color={statusColorMap[VolunteerStateType.ACTIVE_REGULAR]} />,
  [VolunteerStateType.ACTIVE_ACCOMPANY]: (
    <HourglassIcon size={18} color={statusColorMap[VolunteerStateType.ACTIVE_ACCOMPANY]} />
  ),
  [VolunteerStateType.ACTIVE_FEST]: <HourglassIcon size={18} color={statusColorMap[VolunteerStateType.ACTIVE_FEST]} />,
  [VolunteerStateType.TO_REMATCH]: <HourglassIcon size={18} color={statusColorMap[VolunteerStateType.TO_REMATCH]} />,
  [VolunteerStateType.TEMP_INACTIVE]: (
    <HourglassIcon size={18} color={statusColorMap[VolunteerStateType.TEMP_INACTIVE]} />
  ),
  [VolunteerStateType.INACTIVE]: <FlagIcon size={18} color={statusColorMap[VolunteerStateType.INACTIVE]} />,
};

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
