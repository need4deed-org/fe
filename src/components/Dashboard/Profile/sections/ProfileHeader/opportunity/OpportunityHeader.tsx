"use client";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { useUpdateOpportunityStatus } from "@/hooks/useUpdateOpportunityStatus";
import { formatDateTime } from "@/utils";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { createVolunteerTypeLabelMap, EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";

type Props = {
  opportunity: ApiOpportunityGet;
};

const createStatusLabelMap = (t: (key: string) => string): Record<OpportunityStatusType, string> => ({
  [OpportunityStatusType.NEW]: t("dashboard.opportunityProfile.status.new"),
  [OpportunityStatusType.ACTIVE]: t("dashboard.opportunityProfile.status.active"),
  [OpportunityStatusType.PAST]: t("dashboard.opportunityProfile.status.past"),
  [OpportunityStatusType.SEARCHING]: t("dashboard.opportunityProfile.status.searching"),
});

export const OpportunityHeader = ({ opportunity }: Props) => {
  const { t } = useTranslation();
  const { mutate: updateStatus } = useUpdateOpportunityStatus(opportunity.id);

  const statusLabels = createStatusLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const postedDate = opportunity.createdAt ? formatDateTime(opportunity.createdAt) : EMPTY_PLACEHOLDER_VALUE;
  const subtitle = `${t("dashboard.opportunityProfile.postedOn")} ${postedDate}`;
  const isButtonDisabled = opportunity.statusOpportunity !== OpportunityStatusType.NEW;

  const handleStatusChange = () => {
    updateStatus({ statusOpportunity: OpportunityStatusType.SEARCHING });
  };

  return (
    <HeaderCard
      testId="opportunity-header"
      avatar={
        <IconContainer data-testid="opportunity-header-icon">
          <ShootingStarIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
      }
      title={opportunity.title}
      subtitle={subtitle}
    >
      <StatusRowField
        title={t("dashboard.opportunityProfile.currentStatus")}
        status={opportunity.statusOpportunity}
        label={statusLabels[opportunity.statusOpportunity]}
        action={
          <EditButton onClick={handleStatusChange} disabled={isButtonDisabled}>
            {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
          </EditButton>
        }
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
        status={opportunity.volunteerType}
        label={opportunity.volunteerType ? volunteerTypeLabelMap[opportunity.volunteerType] : undefined}
      />
    </HeaderCard>
  );
};
