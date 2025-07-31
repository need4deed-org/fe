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
