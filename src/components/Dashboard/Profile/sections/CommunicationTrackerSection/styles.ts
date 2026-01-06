import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--profile-section-padding);
  gap: var(--spacing-24);
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

export const TableContainer = styled.div`
  width: 100%;
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: var(--color-grey-50);
`;

export const TableHeaderRow = styled.tr``;

export const TableHeaderCell = styled.th`
  padding: var(--spacing-16);
  text-align: left;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  border-bottom: var(--border-width-thin) solid var(--color-grey-200);
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: var(--border-width-thin) solid var(--color-grey-200);
  }
`;

export const TableCell = styled.td`
  padding: var(--spacing-16);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: 0.005em;
  color: var(--color-midnight);
`;

export const ActionCell = styled(TableCell)`
  width: 100px;
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
    opacity: 0.7;
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
  height: 56px;
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-family: "Figtree";
  font-style: normal;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: 0.005em;
  color: var(--color-white);
  transition: background-color 0.2s ease;

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
  padding: 6px 12px;
  gap: var(--spacing-4);
  border-radius: 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.005em;

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
