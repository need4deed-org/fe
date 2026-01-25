import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Heading4 } from "@/components/styled/text";
import { ReactNode } from "react";
import styled from "styled-components";
import { ProfileStatusBadge } from "./ProfileStatusBadge";
import { StatusValue } from "./statusMaps";

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-blue-50);

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    line-height: calc(var(--space-lg) + 4px);
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-blue-700);
    margin: 0;
    width: var(--volunteer-header-label-width);
    flex-shrink: 0;
  }
`;

const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  align-items: center;
  flex: 1;
`;

const TextAndChip = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-32);
  flex: 1;
`;

type Props = {
  title: string;
  status: StatusValue | undefined;
  label: string | undefined;
  showIcon?: boolean;
  extra?: ReactNode;
  action?: ReactNode;
};

export const StatusRowField = ({
  title,
  status,
  label,
  showIcon = true,
  extra,
  action,
}: Props) => (
  <StatusRow data-testid="status-row-field">
    <TextAndChip>
      <Heading4>{title}</Heading4>
      <FieldContainer>
        {status && label ? (
          <ProfileStatusBadge status={status} label={label} showIcon={showIcon} />
        ) : (
          <EmptyPlaceholder />
        )}
        {extra}
      </FieldContainer>
    </TextAndChip>
    {action}
  </StatusRow>
);
