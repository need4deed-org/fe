import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { EditableField } from "@/components/EditableField/EditableField";
import { formatAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/formatters";
import { ApiOpportunityGet, LangPurpose } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { extractOptionTitles, formatLanguagesByPurpose } from "./formatters";
import { FieldRow, TagsValue } from "./styles";
import { OpportunityWithDetails } from "./types";

type Props = {
  opportunity: ApiOpportunityGet;
};

export function OpportunityDetailsDisplay({ opportunity }: Props) {
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
    <FormDetails>
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
        type="text"
        label={t(`${prefix}.numberOfVolunteers`)}
        value={opp.numberOfVolunteers ?? ""}
        setValue={() => {}}
      />

      <FieldRow data-testid="opportunity-details-activities">
        <label>{t(`${prefix}.activities`)}</label>
        <TagsValue>
          {activities.length > 0 ? (
            <Tags tags={activities} backgroundColor="var(--color-salmon)" />
          ) : (
            <EmptyPlaceholder />
          )}
        </TagsValue>
      </FieldRow>

      <FieldRow data-testid="opportunity-details-skills">
        <label>{t(`${prefix}.skills`)}</label>
        <TagsValue>
          {skills.length > 0 ? (
            <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
          ) : (
            <EmptyPlaceholder />
          )}
        </TagsValue>
      </FieldRow>
    </FormDetails>
  );
}
