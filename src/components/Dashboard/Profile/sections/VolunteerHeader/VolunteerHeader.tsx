"use client";
import { defaultAvatarVolunteerProfile, EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime, getImageUrl } from "@/utils";
import { de, enUS } from "date-fns/locale";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ChangeEngagementStatusDialog } from "./ChangeEngagementStatusDialog";
import { createEngagementLabelMap, createMatchLabelMap, createVolunteerTypeLabelMap } from "./constants";
import { StatusRowField } from "./StatusRowField";
import {
  AvatarContainer,
  Card,
  EditButton,
  HeaderContainer,
  Name,
  NameSection,
  ProfileContent,
  ProfileInfo,
  ReturnDateText,
  StatusSection,
  VolunteerSince,
} from "./styles";
import { useEngagementStatusDialog } from "./useEngagementStatusDialog";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const VolunteerHeader = ({ volunteer }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;

  const dialog = useEngagementStatusDialog(volunteer);

  const engagementLabelMap = createEngagementLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const avatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);

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
                <StatusRowField
                  title={t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
                  status={dialog.statusEngagement}
                  label={engagementLabelMap[dialog.statusEngagement]}
                  extra={
                    dialog.statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
                      <ReturnDateText>{formatReturnDate(dialog.returnDate)}</ReturnDateText>
                    )
                  }
                  action={
                    <EditButton onClick={dialog.openDialog}>
                      {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                    </EditButton>
                  }
                />

                <StatusRowField
                  title={t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}
                  status={volunteer.statusMatch}
                  label={volunteer.statusMatch ? matchLabelMap[volunteer.statusMatch] : undefined}
                />

                <StatusRowField
                  title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
                  status={volunteer.statusType}
                  label={volunteer.statusType ? volunteerTypeLabelMap[volunteer.statusType] : undefined}
                  showIcon={false}
                />
              </StatusSection>
            </ProfileInfo>
          </ProfileContent>
        </Card>
      </HeaderContainer>

      <ChangeEngagementStatusDialog
        isOpen={dialog.isOpen}
        onClose={dialog.closeDialog}
        onSave={dialog.saveDialog}
        statusEngagement={dialog.statusEngagement}
        onStatusChange={dialog.setStatusEngagement}
        returnDate={dialog.returnDate}
        onReturnDateChange={dialog.setReturnDate}
        initialReturnDate={dialog.initialReturnDate}
        originalStatus={volunteer.statusEngagement}
        engagementLabelMap={engagementLabelMap}
        locale={locale}
        t={t}
      />
    </>
  );
};
