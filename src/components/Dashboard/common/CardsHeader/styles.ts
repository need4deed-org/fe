import styled from "styled-components";

import { Heading2 } from "../../../styled/text";
import { hyphenationStyles } from "../../../styled/mixins";

export const RemoveFilterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cards-header-filter-item-icon-div-size);
  height: var(--cards-header-filter-item-icon-div-size);
  border-radius: var(--cards-header-filter-item-icon-div-border-radius);

  flex-shrink: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-midnight);
  cursor: pointer;

  &:hover {
    background-color: var(--color-pink-200);
  }
`;

export const HeaderFilterItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--color-pink-50);
`;

export const HeaderFilterItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-cards-header-filter-item-container-gap);
  flex-wrap: wrap;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);

  @media (max-width: 767px) {
    gap: var(--spacing-16);
  }
`;

export const TabsSearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-tabs-searchbar-gap, var(--spacing-12));
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--opportunities-header-tabs-gap);
  min-width: 0;

  flex-wrap: wrap;

  @media (max-width: 767px) {
    gap: 0 var(--spacing-12);
  }
`;

export const FilterControls = styled.div`
  display: grid;
  gap: var(--spacing-24);
`;

export const SearchBarSectionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--filters-search-bar-section-container-gap);
  flex-wrap: wrap;

  @media (max-width: 767px) {
    gap: var(--spacing-8);
  }
`;

export const SearchField = styled.div`
  flex: 1 1 14rem;
  min-width: 0;
  max-width: var(--filters-search-bar-width);

  @media (max-width: 767px) {
    flex: 1 0 100%;
  }

  @media (max-width: 359px) {
    --search-container-height: var(--spacing-48);
    --search-container-border-radius: var(--button-border-radius);
    --search-container-padding: 0 var(--spacing-16);
  }
`;

type TabHeadingProps = {
  $isSelected: boolean;
};

export const TabHeading = styled.button<TabHeadingProps>`
  cursor: pointer;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-midnight);
  font-family: inherit;
  font-weight: var(--text-h4-font-weight, 500);
  font-size: var(--text-h4-font-size, 1rem);
  line-height: var(--text-h4-line-height, 1.25);
  letter-spacing: var(--text-h4-letter-spacing);
  border-bottom: ${(props) =>
    props.$isSelected
      ? "var(--opportunities-header-tabs-border-bottom, var(--border-width-medium)) solid currentColor"
      : "none"};
  padding-bottom: ${(props) =>
    props.$isSelected ? "var(--opportunities-header-tabs-padding-bottom, var(--spacing-4))" : "0"};
`;

export const HyphenatedHeading2 = styled(Heading2)`
  ${hyphenationStyles}
`;

export const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--filters-clear-all-button-height);
  padding: var(--filters-clear-all-button-padding);
  background: var(--color-white);
  border: none;
  cursor: pointer;
  border-radius: var(--cards-header-filter-item-border-radius);
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: var(--opportunity-filter-chip-avatar-size);
  height: var(--opportunity-filter-chip-avatar-size);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const DefaultAvatarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--opportunity-filter-chip-default-avatar-bg);
`;

export const EntityChip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--opportunity-filter-chip-bg);
`;

export const RemoveEntityFilterButton = styled(RemoveFilterButton)`
  color: var(--color-white);

  &:hover {
    background-color: var(--opportunity-filter-chip-x-hover-bg);
  }
`;
