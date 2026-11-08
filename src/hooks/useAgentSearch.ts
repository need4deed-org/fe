import { apiPathAgent } from "@/config/constants";
import { ApiAgentGetList } from "need4deed-sdk";
import { useDebounce } from "./useDebounce";
import { useGetQuery } from "./useGetQuery";

const SEARCH_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

export type AgentOption = { id: number; title: string };

export const useAgentSearch = (search: string, enabled = true): AgentOption[] => {
  const query = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);
  const { data = [] } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents", "search", query],
    apiPath: `${apiPathAgent}/`,
    params: { limit: SEARCH_LIMIT, filter: { search: query } },
    enabled: enabled && query.length >= MIN_SEARCH_LENGTH,
  });
  return data.map(({ id, title }) => ({ id: Number(id), title }));
};
