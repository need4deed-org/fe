import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { UsersFour } from "@phosphor-icons/react";
import styled from "styled-components";

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: var(--profile-section-field-row-gap);
  padding: var(--profile-section-field-row-padding);
  border-bottom: none;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--color-midnight);
  width: 220px;
  flex-shrink: 0;
`;

const FieldValue = styled.div`
  font-size: 20px;
  color: var(--color-midnight);
  flex: 1;
  line-height: 1.5;
`;

const VolunteerTypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--profile-section-badge-gap);
  padding: var(--profile-section-badge-padding);
  background-color: var(--color-blue-500);
  color: var(--color-white);
  border-radius: var(--card-border-radius);
  font-size: 16px;
  font-weight: 500;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-section-tags-gap);
`;

type Props = {
  languages: string;
  availability: string;
  districts: string;
  volunteerType: string;
  activities: string[];
  skills: string[];
  t: (key: string) => string;
};

export function DisplayFields({ languages, availability, districts, volunteerType, activities, skills, t }: Props) {
  return (
    <>
      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.languages")}</FieldLabel>
        <FieldValue>{languages}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.availability")}</FieldLabel>
        <FieldValue>{availability}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.districts")}</FieldLabel>
        <FieldValue>{districts}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.volunteerType")}</FieldLabel>
        <FieldValue>
          {volunteerType ? (
            <VolunteerTypeBadge>
              <UsersFour size={20} weight="fill" />
              {volunteerType}
            </VolunteerTypeBadge>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.activities")}</FieldLabel>
        <FieldValue>
          {activities.length > 0 ? (
            <TagsWrapper>
              <Tags tags={activities} backgroundColor="var(--color-pink-100)" />
            </TagsWrapper>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.skills")}</FieldLabel>
        <FieldValue>
          {skills.length > 0 ? (
            <TagsWrapper>
              <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
            </TagsWrapper>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>
    </>
  );
}
