"use client";

import { CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "@/components/Dashboard/Agents/styles";
import { IconDiv } from "@/components/styled/container";
import { Heading4, Paragraph } from "@/components/styled/text";
import { DashboardRoutes } from "@/config/constants";
import { MapPinIcon } from "@phosphor-icons/react";
import { ApiAgentTagCandidate, Lang } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getOrganizationAgentDistrictLabel } from "../OrganizationDetails/formatters";
import { SectionEmptyState } from "../shared/styles";
import { AgentGrid, AgentItemCard } from "./styles";

type Props = {
  agents: ApiAgentTagCandidate[];
};

export const OrganizationAgents = ({ agents }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;

  if (agents.length === 0) {
    return (
      <SectionEmptyState data-testid="organization-agents-empty">
        {t("dashboard.organizationProfile.agents.emptyState")}
      </SectionEmptyState>
    );
  }

  return (
    <AgentGrid data-testid="organization-agents-list">
      {agents.map((agent) => (
        <AgentItemCard
          key={agent.id}
          as={Link}
          href={`/${i18n.language}${DashboardRoutes.Agents}/${agent.id}`}
          data-testid="organization-agent-card"
        >
          <CardHeader>
            <CardHeaderInfo>
              <Heading4>{agent.title}</Heading4>
            </CardHeaderInfo>
          </CardHeader>
          <DistrictContainer>
            <DistrictDiv>
              <IconDiv size="var(--dashboard-agents-card-detail-icon-size)">
                <MapPinIcon weight="fill" />
              </IconDiv>
              <Paragraph>{getOrganizationAgentDistrictLabel(agent.district, lang)}</Paragraph>
            </DistrictDiv>
          </DistrictContainer>
        </AgentItemCard>
      ))}
    </AgentGrid>
  );
};
