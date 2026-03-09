import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import StatusBadge from "../../common/StatusBadge";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { MockOpportunityVolunteer } from "./mockVolunteers";
import { AvatarImg } from "./styles";
import VolunteerDetail from "./VolunteerDetail";

type Props = {
  volunteer: MockOpportunityVolunteer;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export const AccordionVolunteer = ({
  volunteer,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id, name, avatarUrl, engagementStatus, volunteerType, appliedAt } = volunteer;

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/volunteers/${id}`);
  };

  const resolvedAvatarUrl = getImageUrl(avatarUrl || defaultAvatarVolunteerProfile);

  const headerLeft = (
    <>
      <AvatarImg src={resolvedAvatarUrl} alt={name} />
      <Heading4 margin={0} color="var(--color-midnight)">
        {name}
      </Heading4>
      <StatusBadge status={engagementStatus} />
      <StatusBadge status={volunteerType} />
    </>
  );

  return (
    <Accordion
      data-testid="volunteer-accordion"
      headerLeft={headerLeft}
      subtitle={`${t(getDatePrefixKey(currentStatus))} ${appliedAt}`}
      onGoToProfile={handleGoToProfile}
    >
      <VolunteerDetail
        volunteer={volunteer}
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </Accordion>
  );
};
