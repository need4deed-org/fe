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
import { createEngagementStatusLabelMap, createTrustLevelLabelMap, createVolunteerSearchLabelMap } from "./constants";

type Props = {
  agent: ApiAgentProfileGet;
};

export const AgentHeader = ({ agent }: Props) => {
  const { t } = useTranslation();

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
                  <EditButton disabled>{t("dashboard.agentProfile.changeStatus")}</EditButton>
                }
              />

              <StatusRowField
                title={t("dashboard.agentProfile.volunteerSearch")}
                status={agent.volunteerSearch}
                label={volunteerSearchLabels[agent.volunteerSearch]}
              />

              <StatusRowField
                title={t("dashboard.agentProfile.trustLevel")}
                status={agent.trustLevel}
                label={trustLevelLabels[agent.trustLevel]}
              />
            </StatusSection>
          </ProfileInfo>
        </ProfileContent>
      </Card>
    </FlexColumn>
  );
};
