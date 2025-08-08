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
  width: 1244px;
`;
