import { IconDiv } from "@/components/styled/container";
import { Heading4 } from "@/components/styled/text";
import { OpportunityVolunteerStatusType, VolunteerStateMatchType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { iconNameMap } from "../../common/icon";
import StatusBadge from "../../common/StatusBadge";
import { Accordion } from "../shared/Accordion";
import { Opportunity } from "./mockOpps/tempTypes";
import { CategoryTitle, getIconName } from "./mockOpps/tempUtils";
import OpportunityDetail from "./OpportunityDetail";

type Props = {
  opportunity: Opportunity;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export default function AccordionOpportunity({
  opportunity,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
  const { t } = useTranslation();
  const { categoryId, title } = opportunity;
  const iconName = getIconName(categoryId as CategoryTitle);

  const headerLeft = (
    <>
      <IconDiv size="var(--volunteer-profile-section-card-icon-size)">{iconNameMap[iconName]}</IconDiv>
      <Heading4 margin={0} color="var(--color-midnight)">
        {title}
      </Heading4>
      {/* Todo: this will be updated later when opps fetched from API */}
      <StatusBadge status={VolunteerStateMatchType.MATCHED} />
    </>
  );

  return (
    <Accordion
      headerLeft={headerLeft}
      /* Todo: this will be updated later when opps fetched from API */
      subtitle={t("dashboard.volunteerProfile.opportunitiesSec.tabs.matched") + " on 12.02.2025"}
    >
      <OpportunityDetail
        opportunity={opportunity}
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </Accordion>
  );
}
