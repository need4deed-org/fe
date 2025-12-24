import { Tags } from "@/components/core/common/Tags";
import { UsersFour } from "@phosphor-icons/react";
import styled from "styled-components";

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 32px;
  padding: 16px 0;
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
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--color-blue-500);
  color: var(--color-white);
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
            "–"
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
            "–"
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
            "–"
          )}
        </FieldValue>
      </FieldRow>
    </>
  );
}
