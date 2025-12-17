"use client";
import Button from "@/components/core/button/Button/Button";
import Tags from "@/components/core/common/Tags";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading2 } from "@/components/styled/text";
import { User, UsersFour } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: ${(props) => (props.$isEditing ? "16px" : "8px")};
  background: var(--color-white);
  border-radius: 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--color-papaya);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

interface Props {
  volunteer: ApiVolunteerGet;
}

export function VolunteerProfileSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setIsEditing(false);
  };

  // Transform complex types to displayable formats
  const formatLanguages = (langs: typeof volunteer.languages): string => {
    if (!langs || langs.length === 0) return "English – native, French – fluent";
    return langs
      .map((lang) => {
        const proficiency = lang.proficiency ? ` – ${lang.proficiency}` : "";
        return `${lang.title}${proficiency}`;
      })
      .join(", ");
  };

  const formatAvailability = (avails: typeof volunteer.availability): string => {
    if (!avails || avails.length === 0) return "Tuesdays & Thursdays, 9:00-11:00";
    const days = avails.map((a) => a.day).join(" & ");
    const times = avails[0]?.daytime
      ? Array.isArray(avails[0].daytime) && avails[0].daytime.length === 2
        ? `${avails[0].daytime[0]}-${avails[0].daytime[1]}`
        : ""
      : "";
    return times ? `${days}, ${times}` : days;
  };

  const extractTitles = (items: typeof volunteer.activities): string[] => {
    if (!items || items.length === 0) return [];
    return items.map((item) => item.title);
  };

  // Use volunteer prop data with mock data as fallback
  const languages = formatLanguages(volunteer.languages);
  const availability = formatAvailability(volunteer.availability);
  const districts = "Kreuzberg, Friedrichshain";
  const volunteerType = "Accompanying";
  const activities =
    extractTitles(volunteer.activities).length > 0 ? extractTitles(volunteer.activities) : ["Tutoring", "Daycare"];
  const skills = extractTitles(volunteer.skills).length > 0 ? extractTitles(volunteer.skills) : ["Cooking", "Singing"];

  return (
    <Container data-testid="volunteer-profile-section-container" $isEditing={isEditing}>
      <Header>
        <TitleRow>
          <IconContainer>
            <User size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.profileSection.title")}</Heading2>
        </TitleRow>
        {!isEditing && (
          <Button
            text={t("dashboard.volunteerProfile.profileSection.edit")}
            onClick={handleEditClick}
            width="auto"
            padding="16px 24px"
          />
        )}
      </Header>

      <Details>
        {isEditing ? (
          <>
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.languages")}
              value={languages}
              setValue={() => {}}
            />
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.availability")}
              value={availability}
              setValue={() => {}}
            />
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.districts")}
              value={districts}
              setValue={() => {}}
            />
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.volunteerType")}
              value={volunteerType}
              setValue={() => {}}
            />
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.activities")}
              value={activities.join(", ")}
              setValue={() => {}}
            />
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.profileSection.skills")}
              value={skills.join(", ")}
              setValue={() => {}}
            />
          </>
        ) : (
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
                <VolunteerTypeBadge>
                  <UsersFour size={20} weight="fill" />
                  {volunteerType}
                </VolunteerTypeBadge>
              </FieldValue>
            </FieldRow>

            <FieldRow>
              <FieldLabel>{t("dashboard.volunteerProfile.profileSection.activities")}</FieldLabel>
              <FieldValue>
                <TagsWrapper>
                  <Tags tags={activities} backgroundColor="var(--color-pink-100)" />
                </TagsWrapper>
              </FieldValue>
            </FieldRow>

            <FieldRow>
              <FieldLabel>{t("dashboard.volunteerProfile.profileSection.skills")}</FieldLabel>
              <FieldValue>
                <TagsWrapper>
                  <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
                </TagsWrapper>
              </FieldValue>
            </FieldRow>
          </>
        )}
      </Details>

      {isEditing && (
        <FieldRow style={{ justifyContent: "flex-end", gap: "24px" }}>
          <Button
            text={t("dashboard.volunteerProfile.profileSection.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="16px 24px"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="2px solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.volunteerProfile.profileSection.saveChanges")}
            onClick={handleSave}
            width="auto"
            padding="16px 24px"
          />
        </FieldRow>
      )}
    </Container>
  );
}
