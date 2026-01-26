"use client";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { ShootingStar } from "@phosphor-icons/react";
import { ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  Card,
  createVolunteerTypeLabelMap,
  EditButton,
  IconContainer,
  ProfileContent,
  ProfileInfo,
  StatusRowField,
  StatusSection,
  Subtitle,
  Title,
  TitleSection,
} from "../common";
import { ChangeOpportunityStatusDialog } from "./ChangeOpportunityStatusDialog";
import { useOpportunityStatusDialog } from "./useOpportunityStatusDialog";

type Props = {
  opportunity: ApiOpportunityGet;
};

export const OpportunityHeader = ({ opportunity }: Props) => {
  const { t } = useTranslation();
  const dialog = useOpportunityStatusDialog(opportunity);

  // @ts-expect-error createdAt missing on SDK
  const postedDate = opportunity.createdAt ? formatDateTime(opportunity.createdAt) : EMPTY_PLACEHOLDER_VALUE;

  const statusLabels = {
    [OpportunityStatusType.NEW]: t("dashboard.opportunityProfile.status.new"),
    [OpportunityStatusType.ACTIVE]: t("dashboard.opportunityProfile.status.active"),
    [OpportunityStatusType.PAST]: t("dashboard.opportunityProfile.status.past"),
  };

  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  return (
    <>
      <FlexColumn data-testid="opportunity-header">
        <Card>
          <ProfileContent>
            <IconContainer data-testid="opportunity-header-icon">
              <ShootingStar size={120} color="var(--color-blue-500)" weight="duotone" />
            </IconContainer>

            <ProfileInfo>
              <TitleSection>
                <Title>{opportunity.title}</Title>
                <Subtitle>
                  {t("dashboard.opportunityProfile.postedOn")} {postedDate}
                </Subtitle>
              </TitleSection>

              <StatusSection data-testid="opportunity-header-status-section">
                <StatusRowField
                  title={t("dashboard.opportunityProfile.currentStatus")}
                  status={dialog.statusOpportunity}
                  label={statusLabels[dialog.statusOpportunity]}
                  action={
                    <EditButton onClick={dialog.openDialog}>
                      {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                    </EditButton>
                  }
                />

                <StatusRowField
                  title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
                  status={opportunity.volunteerType}
                  label={opportunity.volunteerType ? volunteerTypeLabelMap[opportunity.volunteerType] : undefined}
                />
              </StatusSection>
            </ProfileInfo>
          </ProfileContent>
        </Card>
      </FlexColumn>

      <ChangeOpportunityStatusDialog dialog={dialog} />
    </>
  );
};
