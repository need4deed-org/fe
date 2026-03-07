import { OpportunityVolunteerStatusType } from "need4deed-sdk";

import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer } from "../shared/accordionStyles";
import { AccordionActionProps } from "../shared/types";
import { VolunteerLinkedOpportunity } from "./types";

type Props = {
  opportunity: VolunteerLinkedOpportunity;
  currentStatus: OpportunityVolunteerStatusType;
} & AccordionActionProps;

export default function OpportunityDetail({
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
  return (
    <DetailContainer>
      {onMatch && onNotAMatch && onMarkAsActive && onMarkAsPast && (
        <StatusAccordionActions
          currentStatus={currentStatus}
          onMatch={onMatch}
          onNotAMatch={onNotAMatch}
          onMarkAsActive={onMarkAsActive}
          onMarkAsPast={onMarkAsPast}
        />
      )}
    </DetailContainer>
  );
}
