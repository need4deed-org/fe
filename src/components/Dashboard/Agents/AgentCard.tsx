"use client";

import { MapPinIcon } from "@phosphor-icons/react";
import { ApiAgentGetList, Lang } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { IconDiv } from "@/components/styled/container";

import { Heading4, Paragraph } from "@/components/styled/text";
import { getNormalizedAgent } from "./helpers";
import { createAgentTypeMap, createVolunteerSearchMap } from "./icon";
import { StatusBadge } from "../common/StatusBadge";
import { Card, CardDetailsInfo, CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "./styles";

interface Props {
  agent: ApiAgentGetList;
}

export const AgentCard = ({ agent }: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { id, title, district, volunteerSearch } = getNormalizedAgent(agent);

  const volunteerSearchLabels = createVolunteerSearchMap(t);
  const agentTypeLabels = createAgentTypeMap(t);

  const handleCardClick = () => {
    if (!id) return;

    router.push(`/${i18n.language}/dashboard/agents/${id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        <CardHeaderInfo>
          <Heading4>{title}</Heading4>
        </CardHeaderInfo>
      </CardHeader>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.type")}</Heading4>
        <Paragraph> {agentTypeLabels[agent.type]}</Paragraph>
      </CardDetailsInfo>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.volunteerSearch")}</Heading4>
        <StatusBadge status={agent?.volunteerSearch} label={volunteerSearchLabels[volunteerSearch]} />
      </CardDetailsInfo>
      <DistrictContainer>
        <DistrictDiv>
          <IconDiv size="var(--dashboard-agents-card-detail-icon-size)">
            <MapPinIcon weight="fill" />
          </IconDiv>
          <Heading4 margin={0}>{t("dashboard.agentProfile.district")}</Heading4>
        </DistrictDiv>
        <Paragraph>{district?.title?.[i18n.language as Lang]}</Paragraph>
      </DistrictContainer>
    </Card>
  );
};
