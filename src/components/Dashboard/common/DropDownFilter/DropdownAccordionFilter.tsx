import React from "react";
import AccordionFilter from "../CardsFilter/AccordionFilter";
import { FilterWrapper, ItemCount, OuterContainer, RelativeContainer } from "./styles";
import { FilterItem } from "../CardsFilter/types";

type Props = {
  items: FilterItem[];
  beforeItems?: React.ReactNode;
  triggerLabel?: string;
};

export default function DropdownAccordionFilter({ items, beforeItems, triggerLabel }: Props) {
  return (
    <OuterContainer>
      <ItemCount>({items.filter((item) => item.checked).length})</ItemCount>
      <RelativeContainer>
        <FilterWrapper>
          <AccordionFilter
            header={""}
            items={items}
            isDropdownFilter
            beforeItems={beforeItems}
            triggerLabel={triggerLabel}
          />
        </FilterWrapper>
      </RelativeContainer>
    </OuterContainer>
  );
}
