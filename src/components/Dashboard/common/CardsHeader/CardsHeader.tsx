import { ReactNode, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Paragraph } from "../../../styled/text";
import { Search } from "../../../core/common";
import FiltersButton from "./FiltersButton";
import Filters from "../CardsFilter/Filters";
import Results from "./Results";
import SortBy, { OnChangeSortOrder, SortOption } from "./SortBy";
import { XIcon } from "@phosphor-icons/react";
import { FilterItem } from "../CardsFilter/types";
import { EntityFilterChip } from "./EntityFilterChip";
import {
  ClearAllButton,
  FilterControls,
  HeaderContainer,
  HeaderFilterItem,
  HeaderFilterItemContainer,
  HeaderTitleRow,
  HyphenatedHeading2,
  SearchBarSectionContainer,
  SearchField,
  TabHeading,
  Tabs,
  TabsSearchBarContainer,
  RemoveFilterButton,
} from "./styles";

export type HeadlineOption = {
  key: string;
  label: string;
};

export type EntityFilter = {
  name: string;
  avatarUrl?: string;
  onRemove: () => void;
};

type Props = {
  header: string;
  resultCounter: number;
  resultText: string;
  onSearchInputChange: (input: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  filtersContent: ReactNode;
  showSort: boolean;
  sortOrder: string;
  onSortOrderChange?: OnChangeSortOrder;
  extraSortOptions?: SortOption[];
  activeFilters: FilterItem[];
  onClearAllFilters?: () => void;
  onClearFilter: (filter: string, parentKey?: string) => void;
  entityFilter?: EntityFilter;
  showSearch?: boolean;
  showListControls?: boolean;
  headerAction?: ReactNode;
  headlineOptions?: HeadlineOption[];
  selectedHeadline?: string;
  onHeadlineChange?: (key: string) => void;
  subheader?: string;
};

export default function CardsHeader({
  header,
  resultCounter,
  resultText,
  onSearchInputChange,
  searchValue,
  searchPlaceholder,
  selectedTabIndex,
  setSelectedTabIndex,
  tabs,
  filtersContent,
  showSort,
  sortOrder,
  onSortOrderChange,
  extraSortOptions,
  activeFilters,
  onClearAllFilters,
  onClearFilter,
  entityFilter,
  showSearch = true,
  showListControls = true,
  headerAction,
  headlineOptions,
  selectedHeadline,
  onHeadlineChange,
  subheader,
}: Props) {
  const { t } = useTranslation();
  const filtersId = useId();
  const filtersButton = useRef<HTMLButtonElement>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <HeaderContainer>
      <HeaderTitleRow>
        {headlineOptions?.length ? (
          <Tabs role="tablist">
            {headlineOptions.map((option) => (
              <TabHeading
                type="button"
                role="tab"
                key={option.key}
                aria-selected={selectedHeadline === option.key}
                $isSelected={selectedHeadline === option.key}
                onClick={() => onHeadlineChange?.(option.key)}
              >
                <HyphenatedHeading2 as="span">{option.label}</HyphenatedHeading2>
              </TabHeading>
            ))}
          </Tabs>
        ) : (
          <HyphenatedHeading2>{header}</HyphenatedHeading2>
        )}
        {headerAction}
      </HeaderTitleRow>
      {subheader && <Paragraph>{subheader}</Paragraph>}

      <TabsSearchBarContainer>
        <Tabs role="tablist">
          {tabs.map((tab, index) => (
            <TabHeading
              type="button"
              role="tab"
              aria-selected={selectedTabIndex === index}
              key={tab}
              onClick={() => setSelectedTabIndex(index)}
              $isSelected={selectedTabIndex === index}
            >
              {tab}
            </TabHeading>
          ))}
        </Tabs>

        <FilterControls>
          <SearchBarSectionContainer>
            {showSearch && (
              <SearchField>
                <Search
                  placeHolder={searchPlaceholder ?? `${t("dashboard.searchPlaceHolder")}...`}
                  onInputChange={onSearchInputChange}
                  width="100%"
                  backgroundColor="var(--color-magnolia-light)"
                  value={searchValue}
                />
              </SearchField>
            )}
            {showListControls && (
              <FiltersButton
                panelId={filtersId}
                isFiltersOpen={isFiltersOpen}
                onToggle={(event) => {
                  filtersButton.current = event.currentTarget;
                  setIsFiltersOpen((open) => !open);
                }}
              />
            )}
            {showListControls && showSort && (
              <SortBy sortOrder={sortOrder} onChange={onSortOrderChange} extraOptions={extraSortOptions} />
            )}
          </SearchBarSectionContainer>

          {showListControls && (
            <Filters
              id={filtersId}
              isOpen={isFiltersOpen}
              onClose={() => {
                setIsFiltersOpen(false);
                filtersButton.current?.focus();
              }}
            >
              {filtersContent}
            </Filters>
          )}
        </FilterControls>

        <Results counter={resultCounter} text={resultText} />

        <HeaderFilterItemContainer>
          {entityFilter && (
            <EntityFilterChip
              name={entityFilter.name}
              avatarUrl={entityFilter.avatarUrl}
              onRemove={entityFilter.onRemove}
            />
          )}
          {activeFilters.map((f) => (
            <HeaderFilterItem key={JSON.stringify([f.parentKey, f.keyValue])}>
              <Paragraph
                color="var(--color-midnight)"
                fontSize="var(--cards-header-filter-item-font-size)"
                fontWeight="var(--cards-header-filter-item-font-weight)"
              >
                {f.label}
              </Paragraph>
              <RemoveFilterButton
                type="button"
                aria-label={t("dashboard.filters.remove", { label: f.label })}
                onClick={() => onClearFilter(f.keyValue, f.parentKey)}
              >
                <XIcon size={20} aria-hidden />
              </RemoveFilterButton>
            </HeaderFilterItem>
          ))}
          {activeFilters.length > 0 && onClearAllFilters && (
            <ClearAllButton type="button" onClick={onClearAllFilters}>
              <Paragraph
                color="var(--color-midnight)"
                fontSize="var(--filters-clear-all-button-text-font-size)"
                fontWeight="var(--filters-clear-all-button-text-font-weight)"
              >
                {t("dashboard.filters.clearAll")}
              </Paragraph>
            </ClearAllButton>
          )}
        </HeaderFilterItemContainer>
      </TabsSearchBarContainer>
    </HeaderContainer>
  );
}
