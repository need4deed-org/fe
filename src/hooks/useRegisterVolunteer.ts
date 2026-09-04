import axios from "axios";
import { apiPathVolunteerRegister } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ProfileCompletionData } from "@/components/VolunteerRegistration/types";
import { ApiVolunteerGet } from "need4deed-sdk";

type VolunteerRegistrationPayload = {
  volunteer: ProfileCompletionData;
};

type Props = {
  token: string | null;
  onSuccess?: () => void;
};

export const useRegisterVolunteer = ({ token, onSuccess }: Props) => {
  return useMutationQuery<VolunteerRegistrationPayload, { message: string; data: ApiVolunteerGet }>({
    mutationFn: async (payload: VolunteerRegistrationPayload) => {
      if (!token) {
        throw new Error("Token is required for volunteer registration");
      }
      const response = await axios.post<{ message: string; data: ApiVolunteerGet }>(
        `${apiPathVolunteerRegister}?token=${encodeURIComponent(token)}`,
        payload,
      );
      return response.data;
    },
    onSuccessCallback: onSuccess,
    successMessage: "volunteerRegistration.success.title",
    queryKeyToInvalidate: ["volunteer"],
  });
};
