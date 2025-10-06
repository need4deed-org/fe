import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AccordionFilter from "./AccordionFilter";
import { CardsFilter, Engagement, SetFilter } from "./types";
import { Heading4, Paragraph } from "@/components/styled/text";
import { SwitchButton } from "@/components/core/button";

interface Props {
  filter: CardsFilter;
  setFilter: SetFilter;
}

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();
  const { district, languages, engagement } = filter;

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

  const languageFilterItems = Object.keys(languages)
    .sort()
    .map((l) => {
      return {
        label: l,
        checked: languages[l],
        onChange: (checked: boolean) => {
          languages[l] = checked;

          setFilter((prevFilter) => ({ ...prevFilter, languages }));
        },
      };
    });

  const engagementFilterItems = Object.keys(engagement)
    .sort()
    .map((eng) => {
      const e = eng as keyof Engagement;
      return {
        label: t(`dashboard.volunteers.filters.engagement.${e}`),
        checked: engagement[e],
        onChange: (checked: boolean) => {
          engagement[e] = checked;

          setFilter((prevFilter) => ({ ...prevFilter, language: engagement }));
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
        <Heading4 margin={0} color="var(--color-blue-700)">
          {t("dashboard.volunteers.filters.accompanying")}
        </Heading4>

        <AccompanyingFilterHeaderContainer>
          <SwitchButton isChecked={filter.accompanying} onToggle={accompanyingClickHandler} />

          <Paragraph
            fontWeight="var(--filters-description-font-weight)"
            fontSize="var(--filters-description-font-size)"
            color="var(--color-blue-700)"
            lineheight="var(--filters-description-line-height)"
            letterSpacing="var(--filters-description-letter-spacing)"
          >
            {t("dashboard.volunteers.filters.accompanyingDesc")}
          </Paragraph>
        </AccompanyingFilterHeaderContainer>
      </AccompanyingFilterContainer>

      <AccordionFilter header={t("dashboard.volunteers.filters.engagement.engagement")} items={engagementFilterItems} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilterItems} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilterItems} />

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
  gap: var(--dashboard-volunteers-filters-accompanying-header-container-gap);
  align-items: center;
`;
