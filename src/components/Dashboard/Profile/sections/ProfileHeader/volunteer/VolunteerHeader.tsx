"use client";
import { defaultAvatarVolunteerProfile, EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime, getImageUrl } from "@/utils";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import Image from "next/image";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AvatarContainer,
  createVolunteerTypeLabelMap,
  EditButton,
  HeaderCard,
  ReturnDateText,
  StatusRowField,
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

  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;
  const avatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);
  const subtitle = `${t("dashboard.volunteerProfile.volunteerHeader.volunteer_since")} ${formatDateTime(volunteer.createdAt)}`;

  const formatDateReturn = (date: Date | undefined): string =>
    `${t("dashboard.volunteerProfile.volunteerHeader.until")} ${date ? date.toLocaleDateString("de-DE") : EMPTY_PLACEHOLDER_VALUE}`;

  return (
    <HeaderCard
      testId="volunteer-header"
      avatar={
        <AvatarContainer>
          <Image src={avatarUrl} alt={volunteer.person.firstName} fill style={{ objectFit: "cover" }} />
        </AvatarContainer>
      }
      title={fullName}
      subtitle={subtitle}
      after={<ChangeEngagementStatusDialog dialog={dialog} />}
    >
      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
        status={dialog.selected}
        label={engagementLabelMap[dialog.selected]}
        extra={
          dialog.selected === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
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
    </HeaderCard>
  );
};
