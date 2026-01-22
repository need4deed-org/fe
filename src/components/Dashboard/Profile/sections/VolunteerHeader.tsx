"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { formatDateTime, getImageUrl } from "@/utils";
import {
  ApiVolunteerGet,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Divider from "../common/Divider";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-process-section-header-gap);
`;

const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  padding: var(--spacing-32);
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-24);
  align-items: flex-start;
`;

const AvatarContainer = styled.div`
  position: relative;
  height: var(--avatar-img-logo-width);
  width: var(--avatar-img-logo-width);
  border-radius: var(--percent-50);
  overflow: hidden;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
`;

const Name = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  color: var(--color-blue-700);
  margin: 0;
`;

const VolunteerSince = styled.p`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-blue-500);
  margin: 0;
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StatusRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  column-gap: var(--spacing-24);
  row-gap: var(--spacing-8);
  padding: var(--spacing-16) 0;
  min-height: 60px;

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semi-bold);
    line-height: 1.4;
    color: var(--color-blue-700);
    margin: 0;
  }
`;

const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  align-items: center;
`;

const StatusBadge = styled.div<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-8) var(--spacing-12);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-20);
  width: fit-content;

  ${({ $variant }) => {
    switch ($variant) {
      case "new":
      case "active":
        return `
          background-color: rgba(216, 245, 240, 1);
          color: var(--color-blue-700);
        `;
      case "available":
        return `
          background-color: var(--color-grey-50);
          color: var(--color-grey-700);
        `;
      case "temp_unavailable":
        return `
          background-color: var(--color-red-50);
          color: var(--color-red-500);
        `;
      case "inactive":
      case "unresponsive":
        return `
          background-color: var(--color-grey-50);
          color: var(--color-grey-500);
        `;
      case "no_matches":
      case "needs_rematch":
        return `
          background-color: var(--color-grey-50);
          color: var(--color-grey-700);
        `;
      case "pending_match":
        return `
          background-color: var(--color-red-50);
          color: var(--color-red-500);
        `;
      case "matched":
        return `
          background-color: rgba(216, 245, 240, 1);
          color: var(--color-blue-700);
        `;
      case "accompanying":
      case "regular":
      case "events":
      case "regular_accompanying":
        return `
          background-color: var(--color-blue-100);
          color: var(--color-blue-700);
        `;
      default:
        return `
          background-color: var(--color-grey-50);
          color: var(--color-grey-700);
        `;
    }
  }}
`;

const StatusIcon = styled.span`
  font-size: var(--status-badge-icon-size);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: var(--spacing-16);
  justify-content: flex-end;
  align-items: flex-start;
`;

const EditButton = styled.button`
  background: transparent;
  color: var(--color-blue-500);
  border: none;
  padding: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semi-bold);
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-all);

  &:hover {
    color: var(--color-blue-700);
    opacity: 0.8;
  }
`;

type Props = {
  volunteer: ApiVolunteerGet;
};

const createEngagementLabelMap = (t: (key: string) => string): Record<VolunteerStateEngagementType, string> => ({
  [VolunteerStateEngagementType.NEW]: t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.new"),
  [VolunteerStateEngagementType.ACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.active",
  ),
  [VolunteerStateEngagementType.AVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.available",
  ),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.tempUnavailable",
  ),
  [VolunteerStateEngagementType.INACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.inactive",
  ),
  [VolunteerStateEngagementType.UNRESPONSIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.unresponsive",
  ),
});

const createMatchLabelMap = (t: (key: string) => string): Record<VolunteerStateMatchType, string> => ({
  [VolunteerStateMatchType.NO_MATCHES]: t("dashboard.volunteerProfile.volunteerHeader.matchStatus_options.noMatches"),
  [VolunteerStateMatchType.PENDING_MATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.pendingMatch",
  ),
  [VolunteerStateMatchType.MATCHED]: t("dashboard.volunteerProfile.volunteerHeader.matchStatus_options.matched"),
  [VolunteerStateMatchType.NEEDS_REMATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.needsRematch",
  ),
});

const createVolunteerTypeLabelMap = (t: (key: string) => string): Record<VolunteerStateTypeType, string> => ({
  [VolunteerStateTypeType.ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.accompanying",
  ),
  [VolunteerStateTypeType.REGULAR]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular"),
  [VolunteerStateTypeType.EVENTS]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.events"),
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular-accompanying",
  ),
});

const getEngagementIcon = (status: VolunteerStateEngagementType): string => {
  const icons: Record<VolunteerStateEngagementType, string> = {
    [VolunteerStateEngagementType.NEW]: "✨",
    [VolunteerStateEngagementType.ACTIVE]: "📈",
    [VolunteerStateEngagementType.AVAILABLE]: "📅",
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "📅",
    [VolunteerStateEngagementType.INACTIVE]: "⊖",
    [VolunteerStateEngagementType.UNRESPONSIVE]: "📞",
  };
  return icons[status] || "";
};

const getMatchIcon = (status: VolunteerStateMatchType): string => {
  const icons: Record<VolunteerStateMatchType, string> = {
    [VolunteerStateMatchType.NO_MATCHES]: "⊘",
    [VolunteerStateMatchType.PENDING_MATCH]: "⏳",
    [VolunteerStateMatchType.MATCHED]: "⚓",
    [VolunteerStateMatchType.NEEDS_REMATCH]: "🔌",
  };
  return icons[status] || "";
};

export function VolunteerHeader({ volunteer }: Props) {
  const { t } = useTranslation();

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const initialAvatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);

  const engagementLabelMap = createEngagementLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const engagementLabelToEnum = Object.fromEntries(
    Object.entries(engagementLabelMap).map(([key, value]) => [value, key as VolunteerStateEngagementType]),
  ) as Record<string, VolunteerStateEngagementType>;

  const matchLabelToEnum = Object.fromEntries(
    Object.entries(matchLabelMap).map(([key, value]) => [value, key as VolunteerStateMatchType]),
  ) as Record<string, VolunteerStateMatchType>;

  const volunteerTypeLabelToEnum = Object.fromEntries(
    Object.entries(volunteerTypeLabelMap).map(([key, value]) => [value, key as VolunteerStateTypeType]),
  ) as Record<string, VolunteerStateTypeType>;

  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(
    volunteer.statusEngagement || VolunteerStateEngagementType.NEW,
  );
  const [statusMatch, setStatusMatch] = useState<VolunteerStateMatchType>(
    volunteer.statusMatch || VolunteerStateMatchType.NO_MATCHES,
  );
  const [statusType, setStatusType] = useState<VolunteerStateTypeType | undefined>(volunteer.statusType);
  const [isEditing, setIsEditing] = useState(false);

  const engagementOptions = Object.values(VolunteerStateEngagementType).map((type) => engagementLabelMap[type]);

  const matchOptions = Object.values(VolunteerStateMatchType).map((type) => matchLabelMap[type]);

  const volunteerTypeOptions = Object.values(VolunteerStateTypeType).map((type) => volunteerTypeLabelMap[type]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setStatusEngagement(volunteer.statusEngagement || VolunteerStateEngagementType.NEW);
    setStatusMatch(volunteer.statusMatch || VolunteerStateMatchType.NO_MATCHES);
    setStatusType(volunteer.statusType);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Implement save mutation
    setIsEditing(false);
  };

  return (
    <HeaderContainer data-testid="volunteer-header">
      <Card>
        <ProfileContent>
          <AvatarContainer>
            <Image src={initialAvatarUrl} alt={volunteer.person.firstName} fill style={{ objectFit: "cover" }} />
          </AvatarContainer>

          <ProfileInfo>
            <NameSection>
              <Name>{fullName}</Name>
              <VolunteerSince>
                {t("dashboard.volunteerProfile.volunteerHeader.volunteer_since")} {joinedSince}
              </VolunteerSince>
            </NameSection>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--spacing-8)" }}>
              {!isEditing && (
                <EditButton onClick={handleEditClick}>
                  {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                </EditButton>
              )}
            </div>

            <StatusSection data-testid="volunteer-header-status-section">
              <StatusRow>
                <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}</Heading4>
                <FieldContainer>
                  {isEditing ? (
                    <EditableField
                      mode="edit"
                      type="radio-list"
                      value={engagementLabelMap[statusEngagement]}
                      setValue={(value) => {
                        const enumValue = engagementLabelToEnum[value as string];
                        if (enumValue) setStatusEngagement(enumValue);
                      }}
                      options={engagementOptions}
                    />
                  ) : (
                    <StatusBadge $variant={statusEngagement.toLowerCase()}>
                      <StatusIcon>{getEngagementIcon(statusEngagement)}</StatusIcon>
                      <span>{engagementLabelMap[statusEngagement]}</span>
                    </StatusBadge>
                  )}
                </FieldContainer>
              </StatusRow>
              <Divider color="var(--color-blue-50)" margin="var(--spacing-8) 0" />
              <StatusRow>
                <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}</Heading4>
                <FieldContainer>
                  {isEditing ? (
                    <EditableField
                      mode="edit"
                      type="radio-list"
                      value={matchLabelMap[statusMatch]}
                      setValue={(value) => {
                        const enumValue = matchLabelToEnum[value as string];
                        if (enumValue) setStatusMatch(enumValue);
                      }}
                      options={matchOptions}
                    />
                  ) : (
                    <StatusBadge $variant={statusMatch.toLowerCase()}>
                      <StatusIcon>{getMatchIcon(statusMatch)}</StatusIcon>
                      <span>{matchLabelMap[statusMatch]}</span>
                    </StatusBadge>
                  )}
                </FieldContainer>
              </StatusRow>
              <Divider color="var(--color-blue-50)" margin="var(--spacing-8) 0" />
              <StatusRow>
                <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
                <FieldContainer>
                  {isEditing ? (
                    <EditableField
                      mode="edit"
                      type="radio-list"
                      value={statusType ? volunteerTypeLabelMap[statusType] : ""}
                      setValue={(value) => {
                        const enumValue = volunteerTypeLabelToEnum[value as string];
                        if (enumValue) setStatusType(enumValue);
                      }}
                      options={volunteerTypeOptions}
                    />
                  ) : statusType ? (
                    <StatusBadge $variant={statusType.toLowerCase()}>
                      <span>{volunteerTypeLabelMap[statusType]}</span>
                    </StatusBadge>
                  ) : (
                    <span style={{ color: "var(--color-grey-500)" }}>–</span>
                  )}
                </FieldContainer>
              </StatusRow>
            </StatusSection>
          </ProfileInfo>
        </ProfileContent>
      </Card>

      {isEditing && (
        <ButtonRow style={{ marginTop: "var(--spacing-24)", paddingInline: "var(--spacing-24)" }}>
          <Button
            text={t("dashboard.volunteerProfile.profileSection.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--spacing-12) var(--spacing-24)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--border-width-thin) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.volunteerProfile.profileSection.saveChanges")}
            onClick={handleSave}
            width="auto"
            padding="var(--spacing-12) var(--spacing-24)"
          />
        </ButtonRow>
      )}
    </HeaderContainer>
  );
}
