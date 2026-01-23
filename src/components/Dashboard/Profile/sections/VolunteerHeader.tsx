"use client";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Modal } from "@/components/core/modal/Modal";
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
import { de, enUS } from "date-fns/locale";
import {
  ApiVolunteerGet,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
`;

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-blue-50);

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

const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  align-items: center;
  flex: 1;
`;

const TextAndChip = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const ReturnDateText = styled.span`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
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

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
  padding: 0;
  height: 100%;
`;

const ModalTitle = styled.h3`
  font-size: var(--dialog-title-font-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-blue-700);
  margin: 0;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
`;

const OptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-option-gap);
`;

const RadioOption = styled.label<{ $checked: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dialog-option-gap);
  cursor: pointer;

  input[type="radio"] {
    appearance: none;
    width: var(--dialog-radio-size);
    height: var(--dialog-radio-size);
    border: var(--dialog-radio-border-width) solid var(--color-grey-400);
    border-radius: var(--percent-50);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    &:checked {
      border-color: var(--color-blue-700);

      &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: var(--percent-50);
        background-color: var(--color-blue-700);
        top: var(--percent-50);
        left: var(--percent-50);
        transform: translate(-50%, -50%);
      }
    }
  }
`;

const OptionLabel = styled.span`
  font-size: var(--dialog-label-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-label-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  flex: 1;
`;

const OptionDescription = styled.p`
  font-size: var(--dialog-description-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-description-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-700);
  margin: 0;
`;

const DateFieldContainer = styled.div`
  margin-top: var(--spacing-8);
`;

const ModalButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--dialog-button-gap);
`;

const CancelButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  border: var(--border-width-medium) solid var(--color-aubergine);
  border-radius: 125px;
  background: transparent;
  color: var(--color-aubergine);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  cursor: pointer;
  transition: var(--transition-all);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

const SaveButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  border-radius: 125px;
  background: ${({ $disabled }) => ($disabled ? "var(--color-grey-50)" : "var(--color-aubergine)")};
  color: ${({ $disabled }) => ($disabled ? "var(--color-grey-400)" : "var(--color-white)")};
  border: none;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--letter-spacing-tight);
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: var(--transition-all);

  &:hover:not(:disabled) {
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
  const { t, i18n } = useTranslation();
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);
  const locale = i18n.language === "de" ? de : enUS;

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const initialAvatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);

  const engagementLabelMap = createEngagementLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(volunteer.statusEngagement);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    volunteer.returnDate
      ? new Date(volunteer.returnDate)
      : volunteer.updatedAt
        ? new Date(volunteer.updatedAt)
        : undefined,
  );
  const [initialReturnDate, setInitialReturnDate] = useState<Date | undefined>(
    volunteer.returnDate
      ? new Date(volunteer.returnDate)
      : volunteer.updatedAt
        ? new Date(volunteer.updatedAt)
        : undefined,
  );

  const handleEditClick = () => {
    setIsModalOpen(true);
    const initialDate = volunteer.returnDate
      ? new Date(volunteer.returnDate)
      : volunteer.updatedAt
        ? new Date(volunteer.updatedAt)
        : undefined;
    setReturnDate(initialDate);
    setInitialReturnDate(initialDate);
  };

  const handleModalCancel = () => {
    setStatusEngagement(volunteer.statusEngagement);
    const initialDate = volunteer.returnDate
      ? new Date(volunteer.returnDate)
      : volunteer.updatedAt
        ? new Date(volunteer.updatedAt)
        : undefined;
    setReturnDate(initialDate);
    setInitialReturnDate(initialDate);
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    const payload: { statusEngagement: VolunteerStateEngagementType; returnDate?: string } = {
      statusEngagement,
    };

    if (statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && returnDate) {
      payload.returnDate = returnDate.toISOString();
    }

    updateStatus(payload, {
      onSuccess: () => {
        if (statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && returnDate) {
          setInitialReturnDate(returnDate);
        }
        setIsModalOpen(false);
      },
    });
  };

  const handleStatusChange = (status: VolunteerStateEngagementType) => {
    setStatusEngagement(status);
  };

  const getEngagementDescription = (status: VolunteerStateEngagementType): string => {
    const descriptionKey = `dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.${
      status === VolunteerStateEngagementType.NEW
        ? "new_description"
        : status === VolunteerStateEngagementType.ACTIVE
          ? "active_description"
          : status === VolunteerStateEngagementType.AVAILABLE
            ? "available_description"
            : status === VolunteerStateEngagementType.TEMP_UNAVAILABLE
              ? "tempUnavailable_description"
              : status === VolunteerStateEngagementType.INACTIVE
                ? "inactive_description"
                : "unresponsive_description"
    }`;
    return t(descriptionKey);
  };

  return (
    <>
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

              <StatusSection data-testid="volunteer-header-status-section">
                <StatusRow>
                  <TextAndChip>
                    <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}</Heading4>
                    <FieldContainer>
                      <StatusBadge $variant={statusEngagement.toLowerCase()}>
                        <StatusIcon>{getEngagementIcon(statusEngagement)}</StatusIcon>
                        <span>{engagementLabelMap[statusEngagement]}</span>
                      </StatusBadge>
                      {statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
                        <ReturnDateText>
                          {returnDate
                            ? `${t("dashboard.volunteerProfile.volunteerHeader.until")} ${returnDate.toLocaleDateString("de-DE")}`
                            : "–"}
                        </ReturnDateText>
                      )}
                    </FieldContainer>
                  </TextAndChip>
                  <EditButton onClick={handleEditClick}>
                    {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                  </EditButton>
                </StatusRow>
                <StatusRow>
                  <TextAndChip>
                    <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}</Heading4>
                    <FieldContainer>
                      {volunteer.statusMatch ? (
                        <StatusBadge $variant={volunteer.statusMatch.toLowerCase()}>
                          <StatusIcon>{getMatchIcon(volunteer.statusMatch)}</StatusIcon>
                          <span>{matchLabelMap[volunteer.statusMatch]}</span>
                        </StatusBadge>
                      ) : (
                        <span style={{ color: "var(--color-grey-500)" }}>–</span>
                      )}
                    </FieldContainer>
                  </TextAndChip>
                </StatusRow>
                <StatusRow>
                  <TextAndChip>
                    <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
                    <FieldContainer>
                      {volunteer.statusType ? (
                        <StatusBadge $variant={volunteer.statusType.toLowerCase()} $isType>
                          <span>{volunteerTypeLabelMap[volunteer.statusType]}</span>
                        </StatusBadge>
                      ) : (
                        <span style={{ color: "var(--color-grey-500)" }}>–</span>
                      )}
                    </FieldContainer>
                  </TextAndChip>
                </StatusRow>
              </StatusSection>
            </ProfileInfo>
          </ProfileContent>
        </Card>
      </HeaderContainer>

      <Modal isOpen={isModalOpen} onClose={handleModalCancel}>
        <ModalContainer>
          <ModalTitle>{t("dashboard.volunteerProfile.volunteerHeader.modalData.title")}</ModalTitle>

          <OptionsContainer>
            {Object.values(VolunteerStateEngagementType).map((status) => (
              <OptionItem key={status}>
                <RadioOption $checked={statusEngagement === status}>
                  <input
                    type="radio"
                    name="engagement-status"
                    checked={statusEngagement === status}
                    onChange={() => handleStatusChange(status)}
                  />
                  <OptionLabel>{engagementLabelMap[status]}</OptionLabel>
                </RadioOption>
                <OptionDescription>{getEngagementDescription(status)}</OptionDescription>
                {status === VolunteerStateEngagementType.TEMP_UNAVAILABLE && statusEngagement === status && (
                  <DateFieldContainer>
                    <DatePickerWithLabel
                      date={returnDate}
                      onSelect={setReturnDate}
                      locale={locale}
                      allowFuture={true}
                      label={t(
                        "dashboard.volunteerProfile.volunteerHeader.modalData.options.returnDate",
                        "Return date (optional)",
                      )}
                    />
                  </DateFieldContainer>
                )}
              </OptionItem>
            ))}
          </OptionsContainer>

          <ModalButtonRow>
            <CancelButton onClick={handleModalCancel}>
              {t("dashboard.volunteerProfile.volunteerHeader.modalData.cancel")}
            </CancelButton>
            <SaveButton
              onClick={handleModalSave}
              disabled={
                statusEngagement === volunteer.statusEngagement &&
                (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
                  returnDate?.getTime() === initialReturnDate?.getTime())
              }
              $disabled={
                statusEngagement === volunteer.statusEngagement &&
                (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
                  returnDate?.getTime() === initialReturnDate?.getTime())
              }
            >
              {t("dashboard.volunteerProfile.volunteerHeader.modalData.save")}
            </SaveButton>
          </ModalButtonRow>
        </ModalContainer>
      </Modal>
    </>
  );
}
