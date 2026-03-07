import { IconDiv } from "@/components/styled/container";
import { Heading4 } from "@/components/styled/text";
import { OpportunityVolunteerStatusType, VolunteerStateMatchType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { iconNameMap } from "../../common/icon";
import StatusBadge from "../../common/StatusBadge";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { AccordionActionProps } from "../shared/types";
import { Opportunity } from "./mockOpps/tempTypes";
import { CategoryTitle, getIconName } from "./mockOpps/tempUtils";
import OpportunityDetail from "./OpportunityDetail";

type Props = {
  opportunity: Opportunity;
  currentStatus: OpportunityVolunteerStatusType;
} & AccordionActionProps;

export default function AccordionOpportunity({ opportunity, currentStatus, ...actionProps }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { categoryId, title } = opportunity;

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/opportunities/${opportunity.id}`);
  };
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
      subtitle={`${t(getDatePrefixKey(currentStatus))} 12.02.2025`}
      onGoToProfile={handleGoToProfile}
    >
      <OpportunityDetail opportunity={opportunity} currentStatus={currentStatus} {...actionProps} />
    </Accordion>
  );
}
