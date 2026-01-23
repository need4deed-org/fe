"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { useUpdateVolunteerStatus } from "@/hooks/useUpdateVolunteerStatus";
import { formatDateTime, getImageUrl } from "@/utils";
import {
  CalendarIcon,
  CalendarXIcon,
  CheckCircleIcon,
  HourglassIcon,
  MinusCircleIcon,
  PhoneIcon,
  ProhibitIcon,
  SparkleIcon,
  TrendUpIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import {
  ApiVolunteerGet,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const HeaderContainer = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isEditing ? "var(--spacing-24)" : "0")};
`;

const Card = styled.div`
  background: var(--color-white);
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-24);
  align-items: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  height: 280px;
  width: 280px;
  border-radius: var(--percent-50);
  overflow: hidden;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

const Name = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: 36px;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

const VolunteerSince = styled.p`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

const StatusSection = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${(props) => (props.$isEditing ? "0" : "0")};
`;

const StatusRow = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: ${(props) => (props.$isEditing ? "flex-start" : "center")};
  padding: ${(props) => (props.$isEditing ? "0 0" : "var(--spacing-16) 0")};
  border-bottom: ${(props) => (props.$isEditing ? "none" : "var(--border-width-thin) solid var(--color-blue-50)")};

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    line-height: 28px;
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-blue-700);
    margin: 0;
    width: 214px;
    flex-shrink: 0;
  }
`;

const FieldContainer = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  align-items: ${(props) => (props.$isEditing ? "flex-start" : "center")};
  flex: 1;
`;

const TextAndChip = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: ${(props) => (props.$isEditing ? "flex-start" : "center")};
  gap: var(--spacing-32);
  flex: 1;
`;

const StatusBadge = styled.div<{ $variant: string; $isType?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: ${({ $isType }) => ($isType ? "var(--border-radius-medium)" : "var(--border-radius-xs)")};
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  width: fit-content;

  ${({ $variant }) => {
    switch ($variant) {
      case "new":
      case "active":
        return `
          background-color: var(--color-green-100);
          color: var(--color-blue-700);
        `;
      case "available":
        return `
          background-color: var(--color-blue-50);
          color: var(--color-blue-700);
        `;
      case "temp_unavailable":
        return `
          background-color: var(--color-red-50);
          color: var(--color-blue-700);
        `;
      case "inactive":
      case "unresponsive":
        return `
          background-color: var(--color-grey-50);
          color: var(--color-blue-700);
        `;
      case "no_matches":
      case "needs_rematch":
        return `
          background-color: var(--color-grey-50);
          color: var(--color-blue-700);
        `;
      case "pending_match":
        return `
          background-color: var(--color-sand);
          color: var(--color-blue-700);
        `;
      case "matched":
        return `
          background-color: var(--color-green-100);
          color: var(--color-blue-700);
        `;
      case "accompanying":
      case "regular":
      case "events":
      case "regular_accompanying":
        return `
          background-color: var(--color-blue-500);
          color: var(--color-white);
        `;
      default:
        return `
          background-color: var(--color-grey-50);
          color: var(--color-blue-700);
        `;
    }
  }}
`;

const StatusIcon = styled.span`
  width: var(--status-badge-icon-size);
  height: var(--status-badge-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: var(--profile-section-button-row-gap);
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const EditButton = styled.button`
  background: transparent;
  color: var(--color-midnight-bright);
  border: none;
  padding: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-all);
  flex-shrink: 0;

  &:hover {
    color: var(--color-blue-700);
    opacity: var(--opacity-hover);
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

const getEngagementIcon = (status: VolunteerStateEngagementType) => {
  const iconSize = 20;
  const iconWeight = "regular" as const;

  const icons: Record<VolunteerStateEngagementType, React.JSX.Element> = {
    [VolunteerStateEngagementType.NEW]: <SparkleIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateEngagementType.ACTIVE]: <TrendUpIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateEngagementType.AVAILABLE]: <CalendarIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: <CalendarXIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateEngagementType.INACTIVE]: <MinusCircleIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateEngagementType.UNRESPONSIVE]: <PhoneIcon size={iconSize} weight={iconWeight} />,
  };
  return icons[status] || null;
};

const getMatchIcon = (status: VolunteerStateMatchType) => {
  const iconSize = 20;
  const iconWeight = "regular" as const;

  const icons: Record<VolunteerStateMatchType, React.JSX.Element> = {
    [VolunteerStateMatchType.NO_MATCHES]: <ProhibitIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateMatchType.PENDING_MATCH]: <HourglassIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateMatchType.MATCHED]: <CheckCircleIcon size={iconSize} weight={iconWeight} />,
    [VolunteerStateMatchType.NEEDS_REMATCH]: <WrenchIcon size={iconSize} weight={iconWeight} />,
  };
  return icons[status] || null;
};

export function VolunteerHeader({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);

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
  const [statusMatch, setStatusMatch] = useState<VolunteerStateMatchType>(volunteer.statusMatch);
  const [statusType, setStatusType] = useState<VolunteerStateTypeType | undefined>(volunteer.statusType);
  const [isEditing, setIsEditing] = useState(false);

  // Sync local state with prop changes when not editing
  useEffect(() => {
    if (!isEditing) {
      setStatusEngagement(volunteer.statusEngagement || VolunteerStateEngagementType.NEW);
      setStatusMatch(volunteer.statusMatch || VolunteerStateMatchType.NO_MATCHES);
      setStatusType(volunteer.statusType);
    }
  }, [volunteer.statusEngagement, volunteer.statusMatch, volunteer.statusType, isEditing]);

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
    updateStatus(
      {
        statusEngagement,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <HeaderContainer data-testid="volunteer-header" $isEditing={isEditing}>
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

            <StatusSection data-testid="volunteer-header-status-section" $isEditing={isEditing}>
              <StatusRow $isEditing={isEditing}>
                {isEditing ? (
                  <EditableField
                    mode="edit"
                    type="radio-list"
                    label={t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
                    value={engagementLabelMap[statusEngagement]}
                    setValue={(value) => {
                      if (typeof value !== "string") return;
                      const enumValue = engagementLabelToEnum[value];
                      if (enumValue) setStatusEngagement(enumValue);
                    }}
                    options={engagementOptions}
                  />
                ) : (
                  <>
                    <TextAndChip>
                      <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}</Heading4>
                      <FieldContainer>
                        <StatusBadge $variant={statusEngagement.toLowerCase()}>
                          <StatusIcon>{getEngagementIcon(statusEngagement)}</StatusIcon>
                          <span>{engagementLabelMap[statusEngagement]}</span>
                        </StatusBadge>
                      </FieldContainer>
                    </TextAndChip>
                    <EditButton onClick={handleEditClick}>
                      {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                    </EditButton>
                  </>
                )}
              </StatusRow>
              <StatusRow $isEditing={isEditing}>
                {isEditing ? (
                  <EditableField
                    mode="edit"
                    type="radio-list"
                    label={t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}
                    value={matchLabelMap[statusMatch]}
                    setValue={(value) => {
                      const enumValue = matchLabelToEnum[value as string];
                      if (enumValue) setStatusMatch(enumValue);
                    }}
                    options={matchOptions}
                  />
                ) : (
                  <TextAndChip>
                    <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}</Heading4>
                    <FieldContainer>
                      <StatusBadge $variant={statusMatch.toLowerCase()}>
                        <StatusIcon>{getMatchIcon(statusMatch)}</StatusIcon>
                        <span>{matchLabelMap[statusMatch]}</span>
                      </StatusBadge>
                    </FieldContainer>
                  </TextAndChip>
                )}
              </StatusRow>
              <StatusRow $isEditing={isEditing}>
                {isEditing ? (
                  <EditableField
                    mode="edit"
                    type="radio-list"
                    label={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
                    value={statusType ? volunteerTypeLabelMap[statusType] : ""}
                    setValue={(value) => {
                      const enumValue = volunteerTypeLabelToEnum[value as string];
                      if (enumValue) setStatusType(enumValue);
                    }}
                    options={volunteerTypeOptions}
                  />
                ) : (
                  <TextAndChip>
                    <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
                    <FieldContainer>
                      {statusType ? (
                        <StatusBadge $variant={statusType.toLowerCase()} $isType>
                          <span>{volunteerTypeLabelMap[statusType]}</span>
                        </StatusBadge>
                      ) : (
                        <span style={{ color: "var(--color-grey-500)" }}>–</span>
                      )}
                    </FieldContainer>
                  </TextAndChip>
                )}
              </StatusRow>
            </StatusSection>
          </ProfileInfo>
        </ProfileContent>
      </Card>

      {isEditing && (
        <ButtonRow>
          <Button
            text={t("dashboard.volunteerProfile.profileSection.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.volunteerProfile.profileSection.saveChanges")}
            onClick={handleSave}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
          />
        </ButtonRow>
      )}
    </HeaderContainer>
  );
}
