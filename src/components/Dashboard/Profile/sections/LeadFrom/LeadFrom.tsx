import { ApiVolunteerGet } from "need4deed-sdk";
import React from "react";
import { i18nPrefix, LeadFromEnum, LeadIconKey, LeadIconMap } from "./helper";
import { useTranslation } from "react-i18next";
import { Paragraph } from "@/components/styled/text";
import { IconDiv } from "@/components/styled/container";
import { LeadFromContainer } from "./styles";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const LeadFrom = ({ volunteer }: Props) => {
  const { t } = useTranslation();
  const lead = String(volunteer?.leadFrom ?? LeadFromEnum.NONE) as LeadIconKey;
  return (
    <LeadFromContainer>
      <IconDiv>{LeadIconMap[lead]}</IconDiv>
      <Paragraph fontSize="1.5rem" fontWeight={600}>
        {t(`${i18nPrefix}.${lead}`)}
      </Paragraph>
    </LeadFromContainer>
  );
};
