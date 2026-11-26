import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { useAgentProfileSections } from "./useAgentProfileSections";
import { useOpportunityProfileSections } from "./useOpportunityProfileSections";
import { useVolunteerProfileSections } from "./useVolunteerProfileSections";
import { useOrganizationProfileSections } from "./useOrganizationProfileSections";

const empty = { sections: [], heading: "", header: null };

export const useProfileSections = (props: ProfileEntityProps) => {
  const volunteerResult = useVolunteerProfileSections(props.volunteer);
  const opportunityResult = useOpportunityProfileSections(props.opportunity);
  const agentResult = useAgentProfileSections(props.agent);
  const organizationResult = useOrganizationProfileSections(props.organization);

  return volunteerResult ?? agentResult ?? opportunityResult ?? organizationResult ?? empty;
};
