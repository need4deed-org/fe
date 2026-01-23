"use client";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Heading4 } from "@/components/styled/text";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { useUpdateVolunteerStatus } from "@/hooks/useUpdateVolunteerStatus";
import { formatDateTime, getImageUrl } from "@/utils";
import { de, enUS } from "date-fns/locale";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeEngagementStatusDialog } from "./ChangeEngagementStatusDialog";
import {
  createEngagementLabelMap,
  createMatchLabelMap,
  createVolunteerTypeLabelMap,
} from "./constants";
import {
  AvatarContainer,
  Card,
  EditButton,
  FieldContainer,
  HeaderContainer,
  Name,
  NameSection,
  ProfileContent,
  ProfileInfo,
  ReturnDateText,
  StatusRow,
  StatusSection,
  TextAndChip,
  VolunteerSince,
} from "./styles";
import { VolunteerStatusBadge } from "./VolunteerStatusBadge";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const VolunteerHeader = ({ volunteer }: Props) => {
  const { t, i18n } = useTranslation();
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);
  const locale = i18n.language === "de" ? de : enUS;

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const avatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);

  const engagementLabelMap = createEngagementLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(
    volunteer.statusEngagement,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitialDate = (): Date | undefined =>
    volunteer.returnDate
      ? new Date(volunteer.returnDate)
      : volunteer.updatedAt
        ? new Date(volunteer.updatedAt)
        : undefined;

  const [returnDate, setReturnDate] = useState<Date | undefined>(getInitialDate());
  const [initialReturnDate, setInitialReturnDate] = useState<Date | undefined>(getInitialDate());

  const handleEditClick = () => {
    setIsModalOpen(true);
    const initialDate = getInitialDate();
    setReturnDate(initialDate);
    setInitialReturnDate(initialDate);
  };

  const handleModalCancel = () => {
    setStatusEngagement(volunteer.statusEngagement);
    const initialDate = getInitialDate();
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

  const formatReturnDate = (date: Date | undefined): string =>
    date
      ? `${t("dashboard.volunteerProfile.volunteerHeader.until")} ${date.toLocaleDateString("de-DE")}`
      : EMPTY_PLACEHOLDER_VALUE;

  return (
    <>
      <HeaderContainer data-testid="volunteer-header">
        <Card>
          <ProfileContent>
            <AvatarContainer>
              <Image
                src={avatarUrl}
                alt={volunteer.person.firstName}
                fill
                style={{ objectFit: "cover" }}
              />
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
                    <Heading4>
                      {t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
                    </Heading4>
                    <FieldContainer>
                      <VolunteerStatusBadge
                        status={statusEngagement}
                        label={engagementLabelMap[statusEngagement]}
                      />
                      {statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
                        <ReturnDateText>{formatReturnDate(returnDate)}</ReturnDateText>
                      )}
                    </FieldContainer>
                  </TextAndChip>
                  <EditButton onClick={handleEditClick}>
                    {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                  </EditButton>
                </StatusRow>

                <StatusRow>
                  <TextAndChip>
                    <Heading4>
                      {t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}
                    </Heading4>
                    <FieldContainer>
                      {volunteer.statusMatch ? (
                        <VolunteerStatusBadge
                          status={volunteer.statusMatch}
                          label={matchLabelMap[volunteer.statusMatch]}
                        />
                      ) : (
                        <EmptyPlaceholder />
                      )}
                    </FieldContainer>
                  </TextAndChip>
                </StatusRow>

                <StatusRow>
                  <TextAndChip>
                    <Heading4>
                      {t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
                    </Heading4>
                    <FieldContainer>
                      {volunteer.statusType ? (
                        <VolunteerStatusBadge
                          status={volunteer.statusType}
                          label={volunteerTypeLabelMap[volunteer.statusType]}
                          showIcon={false}
                        />
                      ) : (
                        <EmptyPlaceholder />
                      )}
                    </FieldContainer>
                  </TextAndChip>
                </StatusRow>
              </StatusSection>
            </ProfileInfo>
          </ProfileContent>
        </Card>
      </HeaderContainer>

      <ChangeEngagementStatusDialog
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onSave={handleModalSave}
        statusEngagement={statusEngagement}
        onStatusChange={setStatusEngagement}
        returnDate={returnDate}
        onReturnDateChange={setReturnDate}
        initialReturnDate={initialReturnDate}
        originalStatus={volunteer.statusEngagement}
        engagementLabelMap={engagementLabelMap}
        locale={locale}
        t={t}
      />
    </>
  );
};
