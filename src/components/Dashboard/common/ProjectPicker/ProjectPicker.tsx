"use client";

import { Select } from "@/components/core/common/select";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { resolveProjectId, sortAgentOptions } from "@/utils/agent-options";
import { UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const PROJECT_PARAM = "project";

export function useProjectParam() {
  const searchParams = useSearchParams();
  const { agentIds, traegerId, userRole, isLoading } = useGetCurrentAgent();
  const isAgent = userRole === UserRole.AGENT;
  const isTraegerUser = isAgent && Boolean(traegerId);
  const projectId = resolveProjectId({
    requested: searchParams.get(PROJECT_PARAM),
    agentIds,
    isAgent,
    isLoading,
    traegerId,
  });
  return { projectId, isTraegerUser };
}

export function ProjectPicker() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { agentIds, currentAgents } = useGetCurrentAgent();
  const { projectId, isTraegerUser } = useProjectParam();

  if (!isTraegerUser) return null;

  const options = sortAgentOptions(agentIds, currentAgents);

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
