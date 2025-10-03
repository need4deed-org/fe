import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AccordionFilter from "./AccordionFilter";
import { CardsFilter, SetFilter } from "./types";
import { Heading4, Paragraph } from "@/components/styled/text";
import { SwitchButton } from "@/components/core/button";

interface Props {
  filter: CardsFilter;
  setFilter: SetFilter;
}

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();
  const { district } = filter;

  const districtFilterItems = Object.keys(district)
    .sort()
    .map((d) => {
      return {
        label: d,
        checked: district[d],
        onChange: (checked: boolean) => {
          district[d] = checked;

          setFilter((prevFilter) => ({ ...prevFilter, district }));
        },
      };
    });

  const accompanyingClickHandler = () => {
    const accompanying = !filter.accompanying;

    setFilter((prevFilter) => ({ ...prevFilter, accompanying }));
  };

  return (
    <FiltersContentContainer>
      <AccompanyingFilterContainer>
        <AccompanyingFilterHeaderContainer>
          <SwitchButton isChecked={filter.accompanying} onToggle={accompanyingClickHandler} />
          <Heading4 margin={0} color="var(--color-midnight)">
            {t("dashboard.volunteers.filters.accompanying")}
          </Heading4>
        </AccompanyingFilterHeaderContainer>

        <Paragraph
          fontWeight="var(--opportunities-filters-description-font-weight)"
          fontSize="var(--opportunities-filters-description-font-size)"
          color="var(--color-midnight)"
          lineheight="var(--opportunities-filters-description-font-size)"
        >
          {t("dashboard.volunteers.filters.accompanyingDesc")}
        </Paragraph>
      </AccompanyingFilterContainer>

      {/* <AccordionFilter header={t("opportunityPage.filters.activityType")} items={activityTypeFilterItems} /> */}

      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilterItems} />

      {/* <AccordionFilter header={t("opportunityPage.filters.days")} groupedItems={daysFilterItems} /> */}
    </FiltersContentContainer>
  );
}

const FiltersContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--opportunities-filters-content-container-width);
  height: auto;
  gap: var(--opportunities-filters-content-container-gap);
  padding: var(--opportunities-filters-content-container-padding);
`;

const AccompanyingFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const AccompanyingFilterHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
