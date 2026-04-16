import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathPerson } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiRepresentativeGet } from "need4deed-sdk";
import { DeepPartial } from "ts-type-safe";

export const useUpdateAgentContact = (personId: string) => {
  return useMutationQuery<DeepPartial<ApiRepresentativeGet>, ApiAgentProfileGet>({
    apiPath: `${apiPathPerson}${personId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", personId],
  });
};
