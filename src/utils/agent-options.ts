import type { ApiAgentGet, OptionItem } from "need4deed-sdk";

export function sortAgentOptions(
  agentIds: number[],
  agents: Array<Pick<ApiAgentGet, "id" | "title"> | undefined>,
): OptionItem[] {
  return agentIds
    .map((id) => ({ id, title: agents.find((agent) => agent?.id === id)?.title ?? String(id) }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

type ProjectIdInput = {
  requested: string | null;
  agentIds: number[];
  isAgent: boolean;
  isLoading: boolean;
  traegerId: number | undefined;
};

export function resolveProjectId({ requested, agentIds, isAgent, isLoading, traegerId }: ProjectIdInput) {
  const id = Number(requested);
  if (!isAgent || agentIds.length < 2 || !agentIds.includes(id)) return undefined;
  return isLoading || traegerId ? id : undefined;
}
