"use client";

import { Tags } from "@/components/core/common/Tags";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionEmptyState, SectionWrapper } from "../shared/styles";
import { useApiLeadFrom } from "../VolunteerProfile/hooks";
import { resolveLeadFromTitles } from "./helper";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const LeadFrom = ({ volunteer }: Props) => {
  const { t } = useTranslation();
  const { data: leadFromOptions = [] } = useApiLeadFrom();

  const titles = useMemo(
    () => resolveLeadFromTitles(volunteer.leadFrom, leadFromOptions),
    [volunteer.leadFrom, leadFromOptions],
  );

  if (titles.length === 0) {
    return (
      <SectionEmptyState data-testid="lead-from-empty">
        {t("dashboard.volunteerProfile.leadFromEmpty")}
      </SectionEmptyState>
    );
  }

  return (
    <SectionWrapper data-testid="lead-from-container">
      <Tags tags={titles} backgroundColor="var(--color-pink-50)" />
    </SectionWrapper>
  );
};
