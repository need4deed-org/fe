import styled from "styled-components";

export const AvatarWrapper = styled.div`
  position: relative;
  width: var(--opportunity-filter-chip-avatar-size);
  height: var(--opportunity-filter-chip-avatar-size);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const DefaultAvatarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--opportunity-filter-chip-default-avatar-bg);
`;

export const OpportunityChip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--opportunity-filter-chip-bg);
`;

export const XIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cards-header-filter-item-icon-div-size);
  height: var(--cards-header-filter-item-icon-div-size);
  border-radius: var(--cards-header-filter-item-icon-div-border-radius);
  cursor: pointer;

  &:hover {
    background-color: var(--opportunity-filter-chip-x-hover-bg);
  }
`;
