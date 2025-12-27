import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 8px;
  background: var(--color-white);
  border-radius: 24px;
  margin-bottom: 24px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: 24px;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--color-papaya);
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-blue-50);
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-pink-50);
`;

export const HeaderCell = styled.div<{ $width?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 8px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : "1")};

  &:first-child {
    border-radius: 8px 0 0 0;
  }

  &:last-child {
    border-radius: 0 8px 0 0;
    justify-content: center;
  }
`;

export const TableRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  ${(props) => !props.$isLast && "border-bottom: 1px solid var(--color-blue-50);"}

  &:last-child > div:first-child {
    border-radius: 0 0 0 8px;
  }

  &:last-child > div:last-child {
    border-radius: 0 0 8px 0;
  }
`;

export const Cell = styled.div<{ $width?: string; $align?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 8px;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  border-right: 1px solid var(--color-blue-50);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : "1")};

  &:last-child {
    border-right: none;
  }
`;

export const StatusBadge = styled.div<{ $status: "uploaded" | "missing" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  gap: 4px;
  border-radius: 24px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  background: ${(props) => (props.$status === "uploaded" ? "var(--color-green-100)" : "var(--color-red-50)")};
`;

export const ActionButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  padding: 0;
  color: ${(props) => (props.$disabled ? "var(--color-grey-200)" : "var(--color-midnight)")};

  &:hover:not(:disabled) {
    opacity: 0.7;
  }
`;

export const ActionCell = styled(Cell)`
  padding: 16px 8px;
`;
