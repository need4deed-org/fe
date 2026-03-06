import { Heading4 } from "@/components/styled/text";
import { CirclePic } from "@/components/styled/img";
import { getImageUrl } from "@/utils";
import { defaultAvatarURL } from "@/config/constants";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ProfileStatusBadge } from "../ProfileHeader/common";
import { Accordion } from "../shared/Accordion";
import { MappedVolunteerAgent } from "./mockVols/tempUtils";
import { createEngagementStatusLabelMap, createStatusLabelMap } from "./mockVols/tempUtils";
import { VolunteerDetail } from "./VolunteerDetail";

type Props = {
  volunteer: MappedVolunteerAgent;
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
  const { t } = useTranslation();

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const statusLabels = createStatusLabelMap(t);

  const headerLeft = (
    <>
      <CirclePic src={getImageUrl(volunteer?.avatarUrl || defaultAvatarURL)} size="40px" />
      <Heading4 margin={0} color="var(--color-midnight)">
        {volunteer?.name}
      </Heading4>
      {/* Todo: this will be updated later when vol fetched from API */}
      <ProfileStatusBadge
        status={volunteer?.statusEngagement}
        label={engagementStatusLabels[volunteer?.statusEngagement]}
      />
      <ProfileStatusBadge status={volunteer?.statusType} label={statusLabels[volunteer?.statusType]} />
    </>
  );

  return (
    <Accordion
      data-testid="volunteer-accordion"
      headerLeft={headerLeft}
      subtitle={/* Todo: this will be updated later when vol fetched from API */ "Applied on 12.02.2025"}
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
