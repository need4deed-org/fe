import styled from "styled-components";

export const FieldRow = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  > label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }
`;

export const TagsValue = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

export const FieldGroup = styled(FieldRow)`
  align-items: flex-start;

  > label {
    padding-top: var(--spacing-8);
  }

  > div {
    flex: 1;
    min-width: 0;
  }
`;
