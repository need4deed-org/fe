"use client";

import { MapPinIcon } from "@phosphor-icons/react";
import { ApiAgentGet } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { IconDiv } from "@/components/styled/container";

import { Heading2, Heading4, Paragraph } from "@/components/styled/text";
import { getNormalizedAgent } from "./helpers";
import { createEngagementStatusLabelMap, createVolunteerSearchMap } from "./icon";
import { StatusBadge } from "../common/StatusBadge";
import { Card, CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "./styles";

interface Props {
  agent: ApiAgentGet;
}

export const AgentCard = ({ agent }: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { id, title, district, statusEngagement, volunteerSearch } = getNormalizedAgent(agent);

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const volunteerSearchLabels = createVolunteerSearchMap(t);

  const handleCardClick = () => {
    if (!id) return;

    router.push(`/${i18n.language}/dashboard/agents/${id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        <CardHeaderInfo>
          <Heading2>{title}</Heading2>
        </CardHeaderInfo>
      </CardHeader>

      <StatusBadge status={agent?.statusEngagement} label={engagementStatusLabels[statusEngagement]} />
      <StatusBadge status={agent?.volunteerSearch} label={volunteerSearchLabels[volunteerSearch]} />
      <DistrictContainer>
        <DistrictDiv>
          <IconDiv size="var(--dashboard-agents-card-detail-icon-size)">
            <MapPinIcon weight="fill" />
          </IconDiv>
          <Heading4 margin={0}>{t("dashboard.agentProfile.district")}</Heading4>
        </DistrictDiv>
        <Paragraph fontWeight={"20px"}>{district?.title?.[i18n.language as "en" | "de"]}</Paragraph>
      </DistrictContainer>
    </Card>
  );
};
