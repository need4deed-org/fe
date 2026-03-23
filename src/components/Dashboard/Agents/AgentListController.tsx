import { ApiAgentGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect, useState } from "react";
import { useGetQuery } from "@/hooks";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { serializeAgentFilters } from "./helpers";
import { AgentCardsFilter } from "./Filters/types";

const columns = 3;
const rows = 3;
const limit = columns * rows;

type Props = {
  setNumOfAgents: (num: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: AgentCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
};

export const AgentListController = ({ setNumOfAgents, sortOrder, isFiltersOpen, filter, apiFilterOptions }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const serializedFilter = new URLSearchParams(
    serializeAgentFilters(filter, undefined, false, {
      serializeToIDs: true,
      apiFilterOptions,
    }),
  );

  const { data, count } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents"],
    apiPath: `${apiPathAgent}/`,
    params: {
      limit,
      page: currentPage,
      sortOrder,
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
    addLang: false,
  });

  const agents: ApiAgentGetList[] = data || [];

  useEffect(() => {
    setNumOfAgents(count);
  }, [count, setNumOfAgents]);

  return (
    <AgentCardList
      agents={agents}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
