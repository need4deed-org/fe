"use client";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { defaultAvatarVolunteerProfile, EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime, getImageUrl } from "@/utils";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import Image from "next/image";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AvatarContainer,
  Card,
  createVolunteerTypeLabelMap,
  EditButton,
  ProfileContent,
  ProfileInfo,
  ReturnDateText,
  StatusRowField,
  StatusSection,
  Subtitle,
  Title,
  TitleSection,
} from "../common";
import { ChangeEngagementStatusDialog } from "./ChangeEngagementStatusDialog";
import { createEngagementLabelMap, createMatchLabelMap } from "./constants";
import { useEngagementStatusDialog } from "./useEngagementStatusDialog";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const VolunteerHeader = ({ volunteer }: Props) => {
  const { t } = useTranslation();
  const dialog = useEngagementStatusDialog(volunteer);

  const engagementLabelMap = useMemo(() => createEngagementLabelMap(t), [t]);
  const matchLabelMap = useMemo(() => createMatchLabelMap(t), [t]);
  const volunteerTypeLabelMap = useMemo(() => createVolunteerTypeLabelMap(t), [t]);

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const avatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);

  const formatDateReturn = (date: Date | undefined): string =>
    `${t("dashboard.volunteerProfile.volunteerHeader.until")} ${date ? date.toLocaleDateString("de-DE") : EMPTY_PLACEHOLDER_VALUE}`;

  return (
    <>
      <FlexColumn data-testid="volunteer-header">
        <Card>
          <ProfileContent>
            <AvatarContainer>
              <Image src={avatarUrl} alt={volunteer.person.firstName} fill style={{ objectFit: "cover" }} />
            </AvatarContainer>

            <ProfileInfo>
              <TitleSection>
                <Title>{fullName}</Title>
                <Subtitle>
                  {t("dashboard.volunteerProfile.volunteerHeader.volunteer_since")} {joinedSince}
                </Subtitle>
              </TitleSection>

              <StatusSection data-testid="volunteer-header-status-section">
                <StatusRowField
                  title={t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
                  status={dialog.statusEngagement}
                  label={engagementLabelMap[dialog.statusEngagement]}
                  extra={
                    dialog.statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
                      <ReturnDateText>{formatDateReturn(dialog.dateReturn)}</ReturnDateText>
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
                />
              </StatusSection>
            </ProfileInfo>
          </ProfileContent>
        </Card>
      </FlexColumn>

      <ChangeEngagementStatusDialog dialog={dialog} />
    </>
  );
};
