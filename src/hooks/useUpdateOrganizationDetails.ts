import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathOrganization } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiRepresentativePatch } from "need4deed-sdk";
import { DeepPartial } from "ts-type-safe";

export const useUpdateOrganization = (organizationId: string) => {
  return useMutationQuery<DeepPartial<ApiRepresentativePatch>, ApiAgentProfileGet>({
    apiPath: `${apiPathOrganization}${organizationId}`,
    method: "patch",
    successMessage: "__dashboard.agentProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["organization", organizationId],
  });
};
