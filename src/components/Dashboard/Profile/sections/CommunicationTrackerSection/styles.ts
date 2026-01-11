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

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: var(--border-width-thin) solid var(--color-blue-50);
  border-radius: var(--border-radius-small);
  width: 100%;
  overflow: hidden;
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-pink-50);
`;

export const TableHeaderCell = styled.div<{ $width?: string; $maxWidth?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : props.$maxWidth ? "1 1 auto" : "1")};

  &:first-child {
    border-radius: var(--border-radius-small) 0 0 0;
  }

  &:last-child {
    border-radius: 0 var(--border-radius-small) 0 0;
    justify-content: center;
  }
`;

export const TableBody = styled.div``;

export const TableRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  ${(props) => !props.$isLast && `border-bottom: var(--border-width-thin) solid var(--color-blue-50);`}

  &:last-child > div:first-child {
    border-radius: 0 0 0 var(--border-radius-small);
  }

  &:last-child > div:last-child {
    border-radius: 0 0 var(--border-radius-small) 0;
  }
`;

export const TableCell = styled.div<{ $width?: string; $maxWidth?: string; $align?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  border-right: var(--border-width-thin) solid var(--color-blue-50);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : props.$maxWidth ? "1 1 auto" : "1")};

  &:last-child {
    border-right: none;
  }
`;

export const ActionCell = styled(TableCell).attrs<{ $width?: string; $align?: string }>((props) => ({
  $width: props.$width ?? "var(--communication-tracker-action-column-width)",
  $align: props.$align ?? "center",
}))`
  padding: var(--spacing-8);
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

export const EmptyState = styled.div`
  width: 100%;
  padding: var(--spacing-48) var(--spacing-24);
  text-align: center;
  color: var(--color-grey-500);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
`;

export const AddButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: var(--communication-tracker-button-height);
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-family: var(--bs-body-font-family);
  font-style: normal;
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-white);
  transition: var(--transition-background);

  &:hover {
    background: var(--color-aubergine-light);
  }

  &:disabled {
    background: var(--color-grey-200);
    cursor: not-allowed;
    color: var(--color-grey-500);
  }
`;

export const StatusBadge = styled.div<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: var(--communication-tracker-status-badge-padding);
  gap: var(--spacing-4);
  border-radius: var(--border-radius-large);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-14);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);

  ${(props) => {
    switch (props.$type) {
      case "first-time":
        return `
          background: var(--color-orchid-subtle);
          color: var(--color-aubergine);
        `;
      case "active":
        return `
          background: var(--color-green-50);
          color: var(--color-green-700);
        `;
      case "paused":
        return `
          background: var(--color-grey-50);
          color: var(--color-grey-700);
        `;
      case "inactive":
        return `
          background: var(--color-red-50);
          color: var(--color-red-600);
        `;
      default:
        return `
          background: var(--color-grey-50);
          color: var(--color-grey-700);
        `;
    }
  }}
`;

