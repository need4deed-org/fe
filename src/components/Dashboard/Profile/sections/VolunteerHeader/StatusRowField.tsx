import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Heading4 } from "@/components/styled/text";
import { ReactNode } from "react";
import { FieldContainer, StatusRow, TextAndChip } from "./styles";
import { VolunteerStatusBadge } from "./VolunteerStatusBadge";
import { StatusValue } from "../../common/statusMaps";

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
  <StatusRow>
    <TextAndChip>
      <Heading4>{title}</Heading4>
      <FieldContainer>
        {status && label ? (
          <VolunteerStatusBadge status={status} label={label} showIcon={showIcon} />
        ) : (
          <EmptyPlaceholder />
        )}
        {extra}
      </FieldContainer>
    </TextAndChip>
    {action}
  </StatusRow>
);
