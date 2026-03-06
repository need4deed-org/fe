import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, TranslateIcon, WrenchIcon } from "@phosphor-icons/react";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { TagsContainer } from "@/components/core/common/Tags";
import { Tag } from "@/components/styled/tags";
import { ActivitySpan } from "@/components/styled/text";

import { AccordionActions } from "../shared/AccordionActions";
import { DetailContainer, SplitContainer } from "../shared/accordionStyles";
import { DetailParagraph } from "./styles";
import { InfoSection } from "../shared/InfoSection";
import { MockOpportunityVolunteer, MockVolunteerLanguage } from "./mockVolunteers";

interface Props {
  volunteer: MockOpportunityVolunteer;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
}

const MAX_VISIBLE_TAGS = 3;

function groupLanguages(languages: MockVolunteerLanguage[]): [string, string[]][] {
  const grouped = languages.reduce<Record<string, string[]>>((acc, lang) => {
    const key = lang.proficiency;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lang.title);
    return acc;
  }, {});

  return Object.entries(grouped);
}

function LanguagesText({ languages }: { languages: MockVolunteerLanguage[] }) {
  const groups = groupLanguages(languages);

  return (
    <DetailParagraph>
      {groups.map(([proficiency, titles], i) => (
        <span key={proficiency}>
          {i > 0 && ", "}
          <strong>{proficiency}</strong>: {titles.join(", ")}
        </span>
      ))}
    </DetailParagraph>
  );
}

function TagsWithOverflow({ tags }: { tags: string[] }) {
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const remaining = tags.length - MAX_VISIBLE_TAGS;

  return (
    <TagsContainer>
      {visible.map((tag) => (
        <Tag key={tag} $backgroundColor="var(--color-salmon)">
          <ActivitySpan color="var(--color-midnight)">{tag}</ActivitySpan>
        </Tag>
      ))}
      {remaining > 0 && (
        <Tag $backgroundColor="var(--color-salmon)">
          <ActivitySpan color="var(--color-midnight)">+{remaining}</ActivitySpan>
        </Tag>
      )}
    </TagsContainer>
  );
}

export default function VolunteerDetail({
  volunteer,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
  const { t } = useTranslation();
  const { languages, activities, skills, availability, locations } = volunteer;

  const districtsText = locations.join(", ");

  return (
    <DetailContainer>
      {/* 1. Languages & Activities */}
      <SplitContainer>
        <InfoSection icon={TranslateIcon} title={t("dashboard.volunteers.languages")}>
          <LanguagesText languages={languages} />
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteers.activities")}>
          <TagsWithOverflow tags={activities} />
        </InfoSection>
      </SplitContainer>

      {/* 2. Skills & Preferred availability */}
      <SplitContainer>
        <InfoSection icon={WrenchIcon} title={t("dashboard.volunteers.skillsExperience")}>
          <TagsWithOverflow tags={skills} />
        </InfoSection>

        <InfoSection icon={CalendarDotsIcon} title={t("dashboard.volunteers.preferredAvailability")}>
          <DetailParagraph>{availability}</DetailParagraph>
        </InfoSection>
      </SplitContainer>

      {/* 3. Preferred districts */}
      <InfoSection icon={MapPinIcon} title={t("dashboard.volunteers.preferredDistricts")}>
        <DetailParagraph>{districtsText}</DetailParagraph>
      </InfoSection>

      {/* 4. Action Buttons */}
      {currentStatus === OpportunityVolunteerStatusType.SUGGESTED && (
        <AccordionActions onNotAMatch={onNotAMatch} onMatch={onMatch} />
      )}
      {currentStatus === OpportunityVolunteerStatusType.MATCHED && (
        <AccordionActions onNotAMatch={onNotAMatch} onMarkAsActive={onMarkAsActive} />
      )}
      {currentStatus === OpportunityVolunteerStatusType.ACTIVE && <AccordionActions onMarkAsPast={onMarkAsPast} />}
    </DetailContainer>
  );
}
