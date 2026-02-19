import { useMutationQuery } from "@/hooks";
import { AgentRoles, apiPathPerson } from "@/config/constants";
import { DeepPartial } from "ts-type-safe";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";

interface ApiAgentPersonPatch {
  contactDetails: {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    role?: AgentRoles[];
    phone: string;
    email: string;
    landline?: string;
  };
}

export const useUpdateAgentContact = (agentId: string) => {
  return useMutationQuery<DeepPartial<ApiAgentPersonPatch>, ApiAgentProfileGet>({
    apiPath: `${apiPathPerson}${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
