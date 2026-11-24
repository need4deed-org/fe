import { apiPathOrganization } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOrganizationPatch } from "need4deed-sdk";

export const useUpdateOrganization = (
  organizationId: string,
  successMessage = "dashboard.organizationProfile.organisationDetails.saveSuccess",
) => {
  return useMutationQuery<ApiOrganizationPatch, unknown>({
    apiPath: `${apiPathOrganization}${organizationId}`,
    method: "patch",
    successMessage,
    queryKeyToInvalidate: [["organization", organizationId], ["organization"]],
  });
};
