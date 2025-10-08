import styled from "styled-components";
import CloseFilters from "./CloseFilters";
import FiltersContent from "./FiltersContent";
import { CardsFilter, SetFilter } from "./types";

interface Props {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  filter: CardsFilter;
  setFilter: SetFilter;
}

export default function Filters({ isFiltersOpen, setIsFiltersOpen, filter, setFilter }: Props) {
  return isFiltersOpen ? (
    <FiltersContainer>
      <CloseFilters setIsFiltersOpen={setIsFiltersOpen} />
      <FiltersContent setFilter={setFilter} filter={filter} />
    </FiltersContainer>
  ) : null;
}

const FiltersContainer = styled.div`
  position: absolute;
  right: 0;
  width: var(--filters-container-width);
  background: var(--color-pink-50);
  border-bottom-left-radius: var(--filters-container-border-radius);
`;
