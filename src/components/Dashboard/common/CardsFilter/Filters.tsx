import type { ReactNode } from "react";
import AccordionFilter from "./AccordionFilter";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "@/components/core/button";
import { IconName } from "@/components/core/button/Button/icon";
import { Heading3 } from "@/components/styled/text";

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Filters({ id, isOpen, onClose, children }: Props) {
  const { t } = useTranslation();
  const titleId = `${id}-title`;

  return (
    <FiltersContainer
      id={id}
      hidden={!isOpen}
      role="region"
      aria-labelledby={isOpen ? titleId : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
    >
      {isOpen && (
        <>
          <PanelHeader>
            <Heading3 id={titleId} margin={0}>
              {t("dashboard.filters.title")}
            </Heading3>
            <Button
              aria-label={t("dashboard.filters.closeFilters")}
              iconName={IconName.X}
              iconSize="var(--spacing-24)"
              iconColor="var(--color-midnight)"
              backgroundcolor="var(--color-orchid-subtle)"
              height="var(--spacing-48)"
              width="var(--spacing-48)"
              onClick={onClose}
            />
          </PanelHeader>
          {children}
        </>
      )}
    </FiltersContainer>
  );
}

const FiltersContainer = styled.div`
  container: dashboard-filters / inline-size;
  background: var(--color-pink-50);
  border: var(--border-width-thin) solid var(--color-orchid);
  border-radius: var(--border-radius-large);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-12);
  padding: var(--spacing-8) var(--spacing-16) 0;
`;

export const FiltersContentContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: var(--spacing-12) var(--spacing-24);
  padding: var(--spacing-16);

  > * {
    position: relative;
    padding-block-start: var(--spacing-12);
  }

  > *::before {
    content: "";
    display: none;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: calc(100cqw - 2 * var(--spacing-16));
    border-block-start: var(--border-width-thin) solid var(--color-orchid);
    pointer-events: none;
  }

  @container dashboard-filters (width < 40rem) {
    > :first-child {
      padding-block-start: 0;
    }

    > :nth-child(n + 2)::before {
      display: block;
    }
  }

  @container dashboard-filters (40rem <= width < 60rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :nth-child(-n + 2) {
      padding-block-start: 0;
    }

    > :nth-child(2n + 3)::before {
      display: block;
    }
  }

  @container dashboard-filters (width >= 60rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    > :nth-child(-n + 3) {
      padding-block-start: 0;
    }

    > :nth-child(3n + 4)::before {
      display: block;
    }
  }
`;

export const FullWidthFilter = styled(AccordionFilter)`
  && {
    grid-column: 1 / -1;
    border-block-start: var(--border-width-thin) solid var(--color-orchid);
    padding-block-start: var(--spacing-12);
  }

  &&::before {
    display: none;
  }
`;
