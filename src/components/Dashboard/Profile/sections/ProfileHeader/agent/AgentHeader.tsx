"use client";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { House } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types/agent";
import { EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";
import { ChangeAgentEngagementStatusDialog } from "./ChangeAgentEngagementStatusDialog";
import { createEngagementStatusLabelMap, createTrustLevelLabelMap, createVolunteerSearchLabelMap, TRUST_LEVEL_OPTIONS } from "./constants";
import { TrustLevelDropdown } from "./TrustLevelDropdown";
import { useAgentEngagementStatusDialog } from "./useAgentEngagementStatusDialog";

type Props = {
  agent: ApiAgentProfileGet;
};

export const AgentHeader = ({ agent }: Props) => {
  const { t } = useTranslation();
  const dialog = useAgentEngagementStatusDialog(agent);

  const registeredDate = agent.createdAt ? formatDateTime(agent.createdAt) : EMPTY_PLACEHOLDER_VALUE;
  const subtitle = `${t("dashboard.agentProfile.registeredSince")} ${registeredDate}`;

  const engagementStatusLabels = useMemo(() => createEngagementStatusLabelMap(t), [t]);
  const volunteerSearchLabels = useMemo(() => createVolunteerSearchLabelMap(t), [t]);
  const trustLevelLabels = useMemo(() => createTrustLevelLabelMap(t), [t]);

  return (
    <HeaderCard
      testId="agent-header"
      avatar={
        <IconContainer data-testid="agent-header-icon">
          <House size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
      }
      title={agent.name}
      subtitle={subtitle}
      after={<ChangeAgentEngagementStatusDialog dialog={dialog} />}
    >
      <StatusRowField
        title={t("dashboard.agentProfile.engagementStatus")}
        status={agent.statusEngagement}
        label={engagementStatusLabels[agent.statusEngagement]}
        action={
          <EditButton onClick={dialog.openDialog}>{t("dashboard.agentProfile.changeStatus")}</EditButton>
        }
      />

      <StatusRowField
        title={t("dashboard.agentProfile.volunteerSearch")}
        status={agent.volunteerSearch}
        label={volunteerSearchLabels[agent.volunteerSearch]}
      />

      <StatusRowField
        title={t("dashboard.agentProfile.trustLevel")}
        extra={
          <TrustLevelDropdown
            value={agent.trustLevel}
            options={TRUST_LEVEL_OPTIONS}
            labels={trustLevelLabels}
            onChange={() => {}}
          />
        }
      />
    </HeaderCard>
  );
};
