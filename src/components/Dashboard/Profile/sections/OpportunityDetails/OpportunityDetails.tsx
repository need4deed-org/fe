import { EditableField } from "@/components/EditableField/EditableField";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { formatAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/formatters";
import { ApiOpportunityGet, LangPurpose } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { extractOptionTitles, formatLanguagesByPurpose } from "./formatters";
import { OpportunityWithDetails } from "./types";

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const TagsRow = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }
`;

const TagsValue = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

type Props = {
  opportunity: ApiOpportunityGet;
};

export const OpportunityDetails = ({ opportunity }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const mainCommunication = formatLanguagesByPurpose(opp.languages, LangPurpose.GENERAL);
  const residentsSpeak = formatLanguagesByPurpose(opp.languages, LangPurpose.RECIPIENT);
  const schedule = formatAvailability(opp.availability, t);
  const activities = extractOptionTitles(opp.activities, lang);
  const skills = extractOptionTitles(opp.skills, lang);

  return (
    <Details data-testid="opportunity-details">
      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.description`)}
        value={opp.description ?? ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.mainCommunication`)}
        value={mainCommunication}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.residentsSpeak`)}
        value={residentsSpeak}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.schedule`)}
        value={schedule}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="number"
        label={t(`${prefix}.numberOfVolunteers`)}
        value={opp.numberOfVolunteers ?? ""}
        setValue={() => {}}
      />

      <TagsRow data-testid="opportunity-details-activities">
        <label>{t(`${prefix}.activities`)}</label>
        <TagsValue>
          {activities.length > 0 ? (
            <Tags tags={activities} backgroundColor="var(--color-salmon)" />
          ) : (
            <EmptyPlaceholder />
          )}
        </TagsValue>
      </TagsRow>

      <TagsRow data-testid="opportunity-details-skills">
        <label>{t(`${prefix}.skills`)}</label>
        <TagsValue>
          {skills.length > 0 ? (
            <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
          ) : (
            <EmptyPlaceholder />
          )}
        </TagsValue>
      </TagsRow>
    </Details>
  );
};
