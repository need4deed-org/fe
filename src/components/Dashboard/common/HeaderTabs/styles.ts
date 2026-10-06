import styled from "styled-components";

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--opportunities-header-tabs-gap);
  min-width: 0;

  @media (max-width: 767px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      flex-shrink: 0;
    }
  }
`;

type TabHeadingProps = {
  $isSelected: boolean;
};

export const TabHeading = styled.button<TabHeadingProps>`
  cursor: pointer;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-midnight);
  font-family: inherit;
  font-weight: var(--text-h4-font-weight);
  font-size: var(--text-h4-font-size);
  line-height: var(--text-h4-line-height);
  letter-spacing: var(--text-h4-letter-spacing);
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--opportunities-header-tabs-border-bottom) solid currentColor" : "none"};
  padding-bottom: ${(props) => (props.$isSelected ? "var(--opportunities-header-tabs-padding-bottom)" : "0")};
`;
