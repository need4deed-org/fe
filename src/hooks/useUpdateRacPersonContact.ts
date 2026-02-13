import { useMutationQuery } from "@/hooks";
import { AgentRoles, apiPathPerson } from "@/config/constants";
import { DeepPartial } from "ts-type-safe";

interface ApiRacPersonPatch {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  role?: AgentRoles[];
  phone: string;
  email: string;
  landline?: string;
}

export const useUpdatePersonContact = (personId: string) => {
  return useMutationQuery<DeepPartial<ApiRacPersonPatch>, ApiRacPersonPatch>({
    apiPath: `${apiPathPerson}${personId}`,
    method: "patch",
    successMessage: "dashboard.rac.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["person", personId],
  });
};
