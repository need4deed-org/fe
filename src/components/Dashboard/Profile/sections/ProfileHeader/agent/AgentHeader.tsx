"use client";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { House } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types/agent";
import {
  Card,
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

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const volunteerSearchLabels = createVolunteerSearchLabelMap(t);
  const trustLevelLabels = createTrustLevelLabelMap(t);

  return (
    <FlexColumn data-testid="agent-header">
      <Card>
        <ProfileContent>
          <IconContainer data-testid="agent-header-icon">
            <House size={120} color="var(--color-blue-500)" weight="duotone" />
          </IconContainer>

          <ProfileInfo>
            <TitleSection>
              <Title>{agent.name}</Title>
              <Subtitle>
                {t("dashboard.agentProfile.registeredSince")} {registeredDate}
              </Subtitle>
            </TitleSection>

            <StatusSection data-testid="agent-header-status-section">
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
            </StatusSection>
          </ProfileInfo>
        </ProfileContent>
      </Card>
      <ChangeAgentEngagementStatusDialog dialog={dialog} />
    </FlexColumn>
  );
};
