"use client";

import styled from "styled-components";

export interface ContainerProps {
  id: string;
  "background-color"?: string;
  gap?: string;
}

export const FullWidthContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  width: 100%;
  align-items: center;
  background-color: ${(props) => props["background-color"]};
  position: relative;
`;

export const SectionContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: column;
  margin: 0 auto; // Center it horizontally
  padding: var(--homepage-section-container-padding);
  gap: var(--homepage-section-container-gap);
  max-width: var(--max-width-section);
  background-color: ${(props) => props["background-color"]};
`;

interface IconDiVProps {
  size?: string;
  color?: string;
}

export const IconDiv = styled.div<IconDiVProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${(props) => props.size || "var(--icon-size)"};
  height: ${(props) => props.size || "var(--icon-size)"};

  svg {
    // Target the SVG inside IconDiv
    width: 100%; // Make the SVG fill the IconDiv
    height: 100%;
    fill: ${(props) => props.color || "var(--icon-color)"};
  }
`;

export const DashboardBaseContainer = styled.div`
  margin: 0 auto; // Center it horizontally
  width: var(--dashboard-base-container-width);
`;

export const OverlayingSectionContainer = styled(SectionContainer)`
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

export const AppContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  overflow-x: hidden;
`;

export const SectionHeaderContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap};
`;

export const CategoriesContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: grid;
  margin: 0 auto; // Center the grid
  grid-template-columns: var(--homepage-volunteering-categories-grid-template-columns);
  grid-template-rows: var(--homepage-volunteering-categories-grid-template-rows);
  gap: var(--homepage-volunteering-categories-grid-gap);
`;

export const PaginatedCardsContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: column;
  gap: var(--paginated-cards-container-gap);
  background-color: ${(props) => props["background-color"]};
`;

export const OverlayingVisibleCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--paginated-cards-visible-cards-container-gap);

  /* Add padding or margin to create the "border" effect that extends right */
  padding-right: 9999px; /* A large value to simulate "infinity" */
  margin-right: -9999px; /* Counteract the padding to avoid horizontal scrollbar */
  overflow: hidden; /* Hide the excess content from the padding */
`;

export const NextVisibleCardContainer = styled.div`
  display: flex;
  gap: var(--paginated-cards-visible-cards-container-gap);
  position: relative;

  /* The overlay pseudo-element */
  &::before {
    content: ""; /* Essential for pseudo-elements */
    position: absolute; /* Position the overlay over its parent */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(246, 238, 231, 0.2) 0%, rgba(247, 220, 244, 0.8) 34.82%, #f7cdff 100%);
    pointer-events: none; /* Allows clicks to pass through to the elements beneath */
    z-index: 1;
    border-radius: var(--card-border-radius);
  }
`;

export const VisibleCardsContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  gap: var(--paginated-cards-visible-cards-container-gap);
`;

export const IndicatorsContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--indicators-container-gap);
`;

export const ArrowsButtonContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: var(--arrows-button-container-gap);
`;

export const BaseCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--card-border-radius);
`;

export const BaseFooterContainer = styled.div.attrs<ContainerProps>((props) => ({
  id: props.id,
}))<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: var(--homepage-section-container-footer-justify-content);
`;
