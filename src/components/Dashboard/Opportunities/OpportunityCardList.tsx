import { ApiVolunteerOpportunityGetList } from "need4deed-sdk";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityCardListContainer } from "./styles";

type Props = {
  opportunities: ApiVolunteerOpportunityGetList[];
  count: number;
  columns: number;
  rows: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  volunteerId?: string;
};

export function OpportunityCardList({
  opportunities,
  count,
  columns,
  rows,
  currentPage,
  setCurrentPage,
  volunteerId,
}: Props) {
  const items = opportunities.map((opp) => (
    <OpportunityCard key={opp.id} opportunity={opp} volunteerId={volunteerId} />
  ));

  return (
    <OpportunityCardListContainer data-testid="opportunity-card-list">
      <PaginatedGrid
        pageItems={items}
        columns={columns}
        rows={rows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </OpportunityCardListContainer>
  );
}
