import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Heading2, Heading4 } from "../../../styled/text";
import { Search } from "../../../core/common";
import FiltersButton from "./FiltersButton";
import { hyphenationStyles } from "../../../styled/mixins";
import Results from "./Results";
import SortBy from "./SortBy";
import { SortOrder } from "@/config/constants";

interface Props {
  header: string;
  resultCounter: number;
  resultText: string;
  onSearchInputChange: (input: string) => void;
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  setIsFiltersOpen: (isOpen: boolean) => void;
}

export default function CardsHeader({
  header,
  resultCounter,
  resultText,
  onSearchInputChange,
  selectedTabIndex,
  setSelectedTabIndex,
  tabs,
  setIsFiltersOpen,
}: Props) {
  const { t } = useTranslation();

  const handleSortOrderChange = (sortorder: SortOrder) => {
    // Todo: add sorting algo
  };

  return (
    <HeaderContainer>
      <HyphenatedHeading2>{header}</HyphenatedHeading2>

      <TabsSearchBarContainer>
        <TabsSectionContainer>
          <Tabs>
            {tabs.map((tab, index) => (
              <TabHeading key={tab} onClick={() => setSelectedTabIndex(index)} $isSelected={selectedTabIndex === index}>
                {tab}
              </TabHeading>
            ))}
          </Tabs>

          <ResultsSortByContainer>
            <Results counter={resultCounter} text={resultText} />
            <SortBy onChange={handleSortOrderChange} />
          </ResultsSortByContainer>
        </TabsSectionContainer>

        <SearchBarSectionContainer>
          <Search
            placeHolder={`${t("dashboard.searchPlaceHolder")} ...`}
            onInputChange={onSearchInputChange}
            width="var(--dashboard-cards-header-searchbar-width)" //Todo: take this width value as prop when migrating website opportunities.
            backgroundColor="var(--color-magnolia-light)"
          />
          <FiltersButton setIsFiltersOpen={setIsFiltersOpen} />
        </SearchBarSectionContainer>
      </TabsSearchBarContainer>
    </HeaderContainer>
  );
}

/* Styles */

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);
`;

const TabsSearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-tabs-searchbar-gap);
`;

const TabsSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: var(
    --dashboard-cards-header-searchbar-width
  ); //Todo: take this width value as prop when migrating website opportunities.
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--opportunities-header-tabs-gap);
`;

const SearchBarSectionContainer = styled.div`
  display: flex;
  flex-direction: var(--opportunities-header-searchbar-flex-direction);
  justify-content: space-between;
`;

const ResultsSortByContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-cards-header-result-sortBy-gap);
`;

interface TabHeadingProps {
  $isSelected: boolean;
}

const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--opportunities-header-tabs-border-bottom) solid currentColor" : "none"};
  padding-bottom: ${(props) => (props.$isSelected ? "var(--opportunities-header-tabs-padding-bottom)" : "0")};
`;

const HyphenatedHeading2 = styled(Heading2)`
  ${hyphenationStyles}
`;
