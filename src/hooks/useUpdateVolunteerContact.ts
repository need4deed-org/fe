import { ApiVolunteerGet } from "need4deed-sdk";
import { useMutationQuery } from "@/hooks";
import { apiPathVolunteer } from "@/config/constants";

export type UpdateVolunteerContactData = {
  person: {
    id: number;
    phone?: string;
    email?: string;
    address?: {
      id: string | number;
      street?: string;
      city?: string;
      postcode?: {
        code?: string;
      };
    };
  };
};

export const useUpdateVolunteerContact = (volunteerId: number) => {
  return useMutationQuery<UpdateVolunteerContactData, ApiVolunteerGet>({
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["volunteer", volunteerId],
  });
};
