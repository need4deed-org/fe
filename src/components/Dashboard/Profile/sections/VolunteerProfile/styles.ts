import styled from "styled-components";

export const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: var(--profile-section-padding);
  gap: ${(props) => (props.$isEditing ? "var(--profile-section-gap-editing)" : "var(--profile-section-gap)")};
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  margin-bottom: var(--profile-section-margin-bottom);
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
  gap: var(--profile-section-title-gap);
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
  gap: var(--profile-section-gap);
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--profile-section-button-row-gap);
  width: 100%;
`;
