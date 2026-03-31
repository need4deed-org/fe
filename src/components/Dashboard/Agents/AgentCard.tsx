"use client";

import { MapPinIcon } from "@phosphor-icons/react";
import { AgentTrustLevel } from "@/components/Dashboard/Profile/types/agent";
import { ApiAgentGet } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { IconDiv } from "@/components/styled/container";

import {
  createTrustLevelLabelMap,
  TRUST_LEVEL_OPTIONS,
} from "@/components/Dashboard/Profile/sections/ProfileHeader/agent/constants";
import { TrustLevelDropdown } from "@/components/Dashboard/Profile/sections/ProfileHeader/agent/TrustLevelDropdown";
import { Heading2, Heading4, Paragraph } from "@/components/styled/text";
import { useUpdateAgentStatus } from "@/hooks";
import { getNormalizedAgent } from "./helpers";
import { createEngagementStatusLabelMap, createServiceTypeMap, createVolunteerSearchMap } from "./icon";
import { StatusBadge } from "../common/StatusBadge";
import { Card, CardDetailsInfo, CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "./styles";

interface Props {
  agent: ApiAgentGet;
}

export const AgentCard = ({ agent }: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { id, title, district, statusEngagement, volunteerSearch, serviceType } = getNormalizedAgent(agent);

  const { mutate: patchAgent } = useUpdateAgentStatus(agent.id);

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const volunteerSearchLabels = createVolunteerSearchMap(t);
  const trustLevelLabels = createTrustLevelLabelMap(t);
  const serviceTypeLabels = createServiceTypeMap(t);

  const handleCardClick = () => {
    if (!id) return;

    router.push(`/${i18n.language}/dashboard/agents/${id}`);
  };

  const handleTrustLevelChange = (next: AgentTrustLevel) => {
    if (id == null) return;
    patchAgent({ trustLevel: next });
  };

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        <CardHeaderInfo>
          <Heading2>{title}</Heading2>
        </CardHeaderInfo>
      </CardHeader>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.engagementStatus")}</Heading4>
        <StatusBadge status={agent?.statusEngagement} label={engagementStatusLabels[statusEngagement]} />
      </CardDetailsInfo>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.volunteerSearch")}</Heading4>
        <StatusBadge status={agent?.volunteerSearch} label={volunteerSearchLabels[volunteerSearch]} />
      </CardDetailsInfo>
      <CardDetailsInfo onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="presentation">
        <Heading4>{t("dashboard.agentProfile.trustLevel")}</Heading4>
        <TrustLevelDropdown
          value={agent.trustLevel as unknown as AgentTrustLevel}
          options={TRUST_LEVEL_OPTIONS}
          labels={trustLevelLabels}
          onChange={handleTrustLevelChange}
        />
      </CardDetailsInfo>
      {serviceType?.length
        ? serviceType?.map((service) => (
            <CardDetailsInfo key={service}>
              <Heading4>{t("dashboard.agentProfile.serviceType")}</Heading4>
              <Paragraph>{serviceTypeLabels[service]}</Paragraph>
            </CardDetailsInfo>
          ))
        : null}
      <DistrictContainer>
        <DistrictDiv>
          <IconDiv size="var(--dashboard-agents-card-detail-icon-size)">
            <MapPinIcon weight="fill" />
          </IconDiv>
          <Heading4 margin={0}>{t("dashboard.agentProfile.district")}</Heading4>
        </DistrictDiv>
        <Paragraph>{district?.title?.[i18n.language as "en" | "de"]}</Paragraph>
      </DistrictContainer>
    </Card>
  );
};
