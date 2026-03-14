import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { useAgentProfileSections } from "./useAgentProfileSections";
import { useOpportunityProfileSections } from "./useOpportunityProfileSections";
import { useVolunteerProfileSections } from "./useVolunteerProfileSections";

const empty = { sections: [], heading: "", header: null };

export const useProfileSections = (props: ProfileEntityProps) => {
  const volunteerResult = useVolunteerProfileSections(props.volunteer);
  const opportunityResult = useOpportunityProfileSections(props.opportunity);
  const agentResult = useAgentProfileSections(props.agent);

  return volunteerResult ?? agentResult ?? opportunityResult ?? empty;
};
