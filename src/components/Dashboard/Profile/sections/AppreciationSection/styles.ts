import styled from "styled-components";

export const StatusBadge = styled.div<{ $status: "received" | "pending" }>`
  background: ${(props) =>
    props.$status === "received"
      ? "var(--color-green-100)"
      : "var(--color-red-50)"};
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
`;

export const DialogTitle = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 0.14px;
  color: var(--color-midnight);
  margin: 0 0 var(--spacing-24) 0;
`;

export const RadioOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  width: 100%;
`;

export const ExpandedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding-left: 32px;
  border-left: 4px solid rgba(123, 132, 203, 0.15);
  margin-top: var(--spacing-8);
`;

export const SubQuestion = styled.p`
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: var(--color-grey-700);
  margin: 0;
`;

export const SubOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const DateFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: var(--spacing-8);
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: var(--color-grey-50);
  margin: var(--spacing-24) 0;
`;
