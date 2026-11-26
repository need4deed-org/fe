type AgentLike = { id?: number; title?: string } | undefined;

export type AgentOption = { id: number; title: string };

export function sortAgentOptions(agentIds: number[], agents: AgentLike[]): AgentOption[] {
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
