import styled from "styled-components";
import { FlexColumn } from "@/components/styled/FlexColumn";

export const Container = styled(FlexColumn).attrs<{ $isEditing: boolean }>((props) => ({
  $gap: props.$isEditing ? "var(--spacing-16)" : "0",
}))<{ $isEditing: boolean }>``;

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
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;
