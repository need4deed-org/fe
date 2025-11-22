import { ReactNode } from "react";
import styled from "styled-components";

import PaginationNumbers from "./PaginationNumbers";

interface Props {
  pageItems: ReactNode[];
  columns: number;
  rows: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItemCounts: number;
}

export function PaginatedGrid({
  pageItems,
  columns,
  rows,
  currentPage,
  setCurrentPage,
  totalItemCounts,
}: Props) {
  const itemsPerPage = columns * rows;
  const totalPages = Math.ceil(totalItemCounts / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <MainContainer>
      <GridContainer columns={columns} rows={rows}>
        {pageItems}
      </GridContainer>

      <PaginationNumbers
        currentPage={currentPage}
        goToPage={goToPage}
        totalPages={totalPages}
      />
    </MainContainer>
  );
}

export default PaginatedGrid;

/** Styles */

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-container-gap);
`;

interface GridContainerProps {
  columns: number;
  rows: number;
}

const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, auto);
  gap: var(--paginated-grid-container-gap);
`;
