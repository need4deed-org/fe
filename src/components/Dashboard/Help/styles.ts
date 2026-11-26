import styled from "styled-components";
import { Card } from "@/components/styled/card-grid";

export const ChoiceCard = styled(Card).attrs({ as: "button", type: "button" })`
  cursor: pointer;
  font: inherit;
  color: var(--color-midnight);
  text-align: left;

  &:hover,
  &:focus-visible {
    border-color: var(--color-aubergine);
  }
`;

export const Breadcrumbs = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-8);
  margin: 0;
  padding: 0;
  list-style: none;

  li + li::before {
    content: "›";
    margin-right: var(--spacing-8);
    color: var(--color-grey-700);
  }
`;

export const RelatedLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-8);
`;
