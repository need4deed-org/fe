import { FlexColumn } from "@/components/styled/FlexColumn";
import styled from "styled-components";
import { IsEditing } from "@/types";

export const SectionWrapper = styled(FlexColumn).attrs({
  $gap: "var(--spacing-24)",
  $width: "100%",
  $alignItems: "flex-start",
})``;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const SectionEmptyState = styled.div`
  width: 100%;
  padding: var(--spacing-48) var(--spacing-24);
  text-align: center;
  color: var(--color-grey-500);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
`;

export const DialogButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: auto;
  padding-top: var(--spacing-16);
`;

export const DialogForm = styled.form<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

export const FormContainer = styled(FlexColumn).attrs<IsEditing>((props) => ({
  $gap: props.$isEditing ? "var(--spacing-16)" : "0",
}))<IsEditing>``;

export const FormDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const FormButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;
