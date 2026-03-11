import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import axios from "axios";

type StatusUpdatePayload = {
  m2mId: number;
  status: OpportunityVolunteerStatusType;
};

type DeletePayload = { m2mId: number };

export const useUpdateOpportunityVolunteerStatus = (queryKeyToInvalidate: string[]) => {
  return useMutationQuery<StatusUpdatePayload, unknown>({
    mutationFn: async ({ m2mId, status }: StatusUpdatePayload) => {
      const response = await axios.patch(`${apiPathOpportunityVolunteer}/${m2mId}`, { status });
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.statusUpdateSuccess",
    queryKeyToInvalidate,
  });
};

export const useDeleteOpportunityVolunteer = (queryKeyToInvalidate: string[]) => {
  return useMutationQuery<DeletePayload, unknown>({
    mutationFn: async ({ m2mId }: DeletePayload) => {
      const response = await axios.delete(`${apiPathOpportunityVolunteer}/${m2mId}`);
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.removeSuccess",
    queryKeyToInvalidate,
  });
};
