import { ApiVolunteerOpportunityGetList, LangPurpose, ProfileVolunteeringType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Tags } from "@/components/core/common";
import { Paragraph } from "@/components/styled/text";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { IconName } from "../Volunteers/icon";
import { getLanguagesByPurpose, getOptionTitles } from "./helpers";
import { formatAvailability, statusColorMap, statusIconMap, volunteerTypeIconMap } from "./OpportunityCard.helpers";
import { Card, LanguageRow, StatusDiv, StatusTagsDiv, TagDiv, TitleParagraph } from "./styles";

type Props = {
  opportunity: ApiVolunteerOpportunityGetList;
  volunteerId?: string;
};

export function OpportunityCard({ opportunity, volunteerId }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { id, title, volunteerType, statusOpportunity, languages, activities, location, availability } = opportunity;

  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const recipientLanguage = getLanguagesByPurpose(languages, LangPurpose.RECIPIENT);
  const activityTitles = getOptionTitles(activities);
  const locationTitles = getOptionTitles(location);

  const scheduleText = availability?.length > 0 ? formatAvailability(availability) : null;

  const handleCardClick = () => {
    if (!id) return;
    const params = volunteerId ? `?volunteer=${volunteerId}` : "";
    router.push(`/${i18n.language}/dashboard/opportunities/${id}${params}`);
  };

  return (
    <Card onClick={handleCardClick} data-testid="opportunity-card">
      <StatusTagsDiv>
        {statusOpportunity && (
          <StatusDiv>
            {statusIconMap[statusOpportunity]}
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
              color={statusColorMap[statusOpportunity]}
            >
              {t(`dashboard.opportunities.status.${statusOpportunity}`)}
            </Paragraph>
          </StatusDiv>
        )}
        {volunteerType && (
          <TagDiv>
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
            >
              {t(`dashboard.opportunities.type.${volunteerType}`)}
            </Paragraph>
            {volunteerTypeIconMap[volunteerType as ProfileVolunteeringType]}
          </TagDiv>
        )}
      </StatusTagsDiv>

      <TitleParagraph>{title}</TitleParagraph>

      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        {mainCommunication && (
          <LanguageRow>
            <CardParagraph text={`${t("dashboard.opportunities.card.mainCommunication")}:`} isBold />
            <CardParagraph text={mainCommunication} />
          </LanguageRow>
        )}
        {recipientLanguage && (
          <LanguageRow>
            <CardParagraph text={`${t("dashboard.opportunities.card.residentsSpeak")}:`} isBold />
            <CardParagraph text={recipientLanguage} />
          </LanguageRow>
        )}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.activities")} iconName={IconName.ShootingStar}>
        <Tags tags={activityTitles} />
      </CardDetail>

      <CardDetail header={t("dashboard.opportunities.dateOfAppointment")} iconName={IconName.CalendarDots}>
        {scheduleText && <CardParagraph text={scheduleText} />}
      </CardDetail>

      <CardDetail header={t("dashboard.opportunities.district")} iconName={IconName.MapPin}>
        {locationTitles.length > 0 && <CardParagraph text={locationTitles.join(", ")} />}
      </CardDetail>
    </Card>
  );
}
