"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import Tags from "@/components/core/common/Tags";
import { Heading2 } from "@/components/styled/text";
import { User, UsersFour, Backpack, Lightbulb } from "@phosphor-icons/react";
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

const SkillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    font-size: 16px;
    color: var(--color-midnight);
  }
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

  // Mock data - replace with actual volunteer data when available
  const languages = "English – native, French – fluent";
  const availability = "Tuesdays & Thursdays, 9:00-11:00";
  const districts = "Kreuzberg, Friedrichshain";
  const volunteerType = "Accompanying";
  const activities = ["Tutoring", "Daycare"];
  const skills = ["Cooking", "Singing"];

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
                <SkillsWrapper>
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </SkillsWrapper>
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
