import { useRef, useState } from "react";
import styled from "styled-components";
import { ButtonSpan, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { Checkbox, CheckButton } from "@/components/core/button";
import { useClickOutside } from "@/hooks";
import { FilterItem } from "./types";

interface Props {
  header: string;
  items?: FilterItem[];
  groupedItems?: GroupedFilterItem[];
  groupedItemsDisplayType?: "checkbox" | "button";
  isDropdownFilter?: boolean;
}
interface GroupedFilterItem {
  label: string;
  items: FilterItem[];
}

const cssVar = (name: string, fallback: string) =>
  (typeof document !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue(name).trim()) ||
  fallback;

export default function AccordionFilter({
  header,
  items,
  groupedItems,
  groupedItemsDisplayType = "checkbox",
  isDropdownFilter = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGroupItemCheckbox = groupedItemsDisplayType === "checkbox";

  const openContainerRef = useRef<HTMLDivElement>(null);

  const checkboxHeight = cssVar("--opportunities-filters-content-accordion-options-checkbox-height", "18px");

  const groupCheckboxHeight = cssVar("--opportunities-filters-content-accordion-group-options-checkbox-height", "16px");

  const GroupItemCheckComponent = isGroupItemCheckbox ? Checkbox : CheckButton;

  useClickOutside(openContainerRef, () => setIsOpen(false));

  return (
    <FilterContainer ref={openContainerRef}>
      <FilterHeaderContainer
        type="button"
        aria-expanded={isOpen}
        disabled={isDropdownFilter && !items?.length}
        onClick={() => setIsOpen(!isOpen)}
        $isDropdownFilter={isDropdownFilter}
      >
        <ButtonSpan color="var(--color-midnight)" fontSize="20px" fontWeight={600}>
          {header}
        </ButtonSpan>
        <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled />
      </FilterHeaderContainer>

      {isOpen && items && (
        <OptionsContainer $isDropdownFilter={isDropdownFilter}>
          {items.map((item) => (
            <Checkbox
              key={item.label}
              width={checkboxHeight}
              height={checkboxHeight}
              onChange={item.onChange}
              label={item.label}
              checked={item.checked}
            />
          ))}
        </OptionsContainer>
      )}

      {isOpen && groupedItems && (
        <OptionsContainer>
          {groupedItems.map((groupeItem) => (
            <GroupContainer key={groupeItem.label}>
              <Paragraph>{groupeItem.label}</Paragraph>

              <GroupOptionsContainer>
                {groupeItem.items.map((item) => (
                  <GroupItemCheckComponent
                    key={item.label}
                    width={isGroupItemCheckbox ? groupCheckboxHeight : ""}
                    height={isGroupItemCheckbox ? groupCheckboxHeight : "46px"}
                    onChange={item.onChange}
                    label={item.label}
                    checked={item.checked}
                  />
                ))}
              </GroupOptionsContainer>
            </GroupContainer>
          ))}
        </OptionsContainer>
      )}
    </FilterContainer>
  );
}

/* Styles */

// export interface FilterItem extends Pick<CheckboxProps, "onChange"> {
//   label: string;
//   checked: boolean;
// }

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const FilterHeaderContainer = styled.button<{ $isDropdownFilter?: boolean }>(({ $isDropdownFilter }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "0",
  textAlign: "left",
  borderTop: $isDropdownFilter
    ? "none"
    : "var(--opportunities-filters-content-accordion-header-border-top) solid var(--color-orchid)",
  paddingTop: "var(--opportunities-filters-content-accordion-header-padding-top)",
  ...($isDropdownFilter && {
    borderRadius: "50%",
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "translateY(-1px)",
    },
    "&:focus-visible": {
      outline: "2px solid var(--color-aubergine)",
      outlineOffset: "2px",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.45,
      transform: "none",
    },
  }),
}));

const OptionsContainer = styled.div<{ $isDropdownFilter?: boolean }>(({ $isDropdownFilter }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "var(--opportunities-filters-content-accordion-options-gap)",
  maxHeight: "var(--opportunities-filters-content-accordion-options-max-height)",
  overflowY: "auto",

  ...($isDropdownFilter && {
    position: "absolute",
    top: "calc(100% + var(--spacing-4))",
    right: "0",
    zIndex: 10,
    minWidth: "220px",
    maxWidth: "280px",
    maxHeight: "320px",
    background: "var(--color-white)",
    padding: "var(--spacing-8)",
    border: "1px solid var(--color-grey-200)",
    borderRadius: "var(--border-radius-small)",
    boxShadow: "var(--dropdown-box-shadow)",
    scrollbarWidth: "thin",
    "& > div": {
      minHeight: "40px",
      padding: "var(--spacing-8) var(--spacing-12)",
      borderRadius: "var(--border-radius-xs)",
      whiteSpace: "nowrap",
      transition: "background-color 150ms ease",
    },
    "& > div:hover": {
      background: "var(--color-pink-50)",
    },
  }),
}));

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-accordion-options-gap);
`;

const GroupOptionsContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: var(--filters-accordion-group-options-gap);
`;
