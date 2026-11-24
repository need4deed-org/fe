"use client";

import { Select } from "@/components/core/common/select";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const PROJECT_PARAM = "project";

export function useProjectParam() {
  const searchParams = useSearchParams();
  const { agentIds, userRole } = useGetCurrentAgent();
  const requested = Number(searchParams.get(PROJECT_PARAM));
  const isMultiNgoUser = userRole === UserRole.AGENT && agentIds.length > 1;
  const projectId = isMultiNgoUser && agentIds.includes(requested) ? requested : undefined;
  return { projectId, isMultiNgoUser };
}

export function ProjectPicker() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { agentIds, currentAgents } = useGetCurrentAgent();
  const { projectId, isMultiNgoUser } = useProjectParam();

  const options = useMemo(
    () =>
      agentIds
        .map((id) => ({ id, title: currentAgents.find((agent) => agent?.id === id)?.title ?? String(id) }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [agentIds, currentAgents],
  );

  if (!isMultiNgoUser) return null;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value) params.set(PROJECT_PARAM, value);
    else params.delete(PROJECT_PARAM);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <PickerRow>
      <label htmlFor="project-picker">{t("dashboard.projectPicker.label")}</label>
      <Select id="project-picker" value={projectId ?? ""} onChange={(event) => handleChange(event.target.value)}>
        <option value="">{t("dashboard.projectPicker.all")}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </Select>
    </PickerRow>
  );
}

const PickerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-8);
  color: var(--color-midnight);
  font-weight: var(--font-weight-semibold);
`;
