import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-24);
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const EmptyState = styled.div`
  width: 100%;
  padding: var(--spacing-48) var(--spacing-24);
  text-align: center;
  color: var(--color-grey-500);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
`;