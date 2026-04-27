import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentPatch } from "need4deed-sdk";

// Patches agent-level org details (about, website) via the agent endpoint.
// Note: address and district require the organization's numeric ID which is not
// currently exposed in the agent API response — those fields need a BE change.
export const useUpdateOrganization = (agentId: string) => {
  return useMutationQuery<Pick<ApiAgentPatch, "about" | "website">, ApiAgentProfileGet>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.organisationDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
