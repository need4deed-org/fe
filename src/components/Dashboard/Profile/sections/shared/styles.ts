import styled from "styled-components";
import { FlexColumn } from "@/components/styled/FlexColumn";

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

export const DialogForm = styled(FlexColumn)
  .attrs({
    $gap: "var(--spacing-24)",
  })
  .withComponent("form")``;
