import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AccordionFilter from "./AccordionFilter";
import { Availability, CardsFilter, Engagement, SetFilter } from "./types";
import { Heading4, Paragraph } from "@/components/styled/text";
import { SwitchButton } from "@/components/core/button";
import { ByDay, OccasionalType } from "need4deed-sdk";
import { TFunction } from "i18next";
import { TimeSlot } from "./constants";

interface Props {
  filter: CardsFilter;
  setFilter: SetFilter;
}

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();
  const { district, languages, engagement, availability, accompanying } = filter;

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

          setFilter((prevFilter) => ({ ...prevFilter, engagement }));
        },
      };
    });

  const availabilityFilterItems = createAvailabilityFilterItems(availability, setFilter, t);

  const accompanyingClickHandler = () => {
    setFilter((prevFilter) => ({ ...prevFilter, accompanying: !accompanying }));
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

      <AccordionFilter header={t("dashboard.volunteers.filters.engagement.header")} items={engagementFilterItems} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilterItems} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilterItems} />
      <AccordionFilter
        header={t("dashboard.volunteers.filters.preferredAv.header")}
        groupedItems={availabilityFilterItems}
        groupedItemsDisplayType="button"
      />
    </FiltersContentContainer>
  );
}

const createAvailabilityFilterItems = (availability: Availability, setFilter: SetFilter, t: TFunction) => {
  const { days, occasional, times } = availability;

  return [
    {
      label: t(`dashboard.volunteers.filters.preferredAv.days.header`),
      items: Object.keys(days).map((day) => {
        const d = day as ByDay;
        return {
          label: t(`dashboard.volunteers.filters.preferredAv.days.${d}`),
          checked: days[d],
          onChange: (checked: boolean) => {
            days[d] = checked;

            setFilter((prevFilter) => ({ ...prevFilter, availability }));
          },
        };
      }),
    },
    {
      label: t(`dashboard.volunteers.filters.preferredAv.times.header`),
      items: Object.keys(times).map((timeSlot) => {
        const t = timeSlot as TimeSlot;
        return {
          label: t,
          checked: times[t],
          onChange: (checked: boolean) => {
            times[t] = checked;

            setFilter((prevFilter) => ({ ...prevFilter, availability }));
          },
        };
      }),
    },
    {
      label: t(`dashboard.volunteers.filters.preferredAv.occasional.header`),
      items: Object.keys(occasional).map((item) => {
        const o = item as OccasionalType;
        return {
          label: t(`dashboard.volunteers.filters.preferredAv.occasional.${o}`),
          checked: occasional[o],
          onChange: (checked: boolean) => {
            occasional[o] = checked;

            setFilter((prevFilter) => ({ ...prevFilter, availability }));
          },
        };
      }),
    },
  ];
};

/* Styles */

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

const PreferredAvailabilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* width: 360;
  height: 354;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px; */
`;
