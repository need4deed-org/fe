import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Trigger = styled.button<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  background-color: ${({ $bg }) => $bg};
  color: var(--color-blue-700);
  border: none;
  cursor: pointer;
  white-space: nowrap;
`;

export const Menu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-8) 0;
  list-style: none;
  background: var(--color-white);
  border-radius: var(--border-radius-xs);
  box-shadow: var(--dropdown-box-shadow);
  min-width: 140px;
`;

export const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-8) var(--spacing-16);
  font-size: var(--font-size-lg);
  color: var(--color-blue-700);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;
