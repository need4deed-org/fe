import styled from "styled-components";

export const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-24);
  gap: ${(props) => (props.$isEditing ? "var(--spacing-16)" : "var(--spacing-8)")};
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  margin-bottom: var(--spacing-24);
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-16);
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--color-papaya);
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: var(--spacing-8);
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;
