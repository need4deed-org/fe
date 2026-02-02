import { FlexColumn } from "@/components/styled/FlexColumn";
import styled from "styled-components";

export const Container = styled(FlexColumn).attrs<{ $isEditing: boolean }>((props) => ({
  $gap: props.$isEditing ? "var(--spacing-16)" : "0",
}))<{ $isEditing: boolean }>``;

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
