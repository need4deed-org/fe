import { apiPathEvent, apiPathEventRegistration, apiPathVolunteer } from "@/config/constants";
import type {
  ApiEventN4DRegistrationListGet,
  ApiEventN4DRegistrationPost,
  ApiVolunteerEventN4DGet,
} from "need4deed-sdk";

import { useGetQuery } from "./useGetQuery";
import { mutateData, useMutationQuery } from "./useMutationQuery";

const REGISTRATIONS_QUERY_KEY = ["event-registrations"];

export function useEventRegistrations(eventId: number, enabled = true) {
  return useGetQuery<ApiEventN4DRegistrationListGet>({
    queryKey: [...REGISTRATIONS_QUERY_KEY, "event", String(eventId)],
    apiPath: `${apiPathEvent}/${eventId}/registrations`,
    enabled,
  });
}

export function useVolunteerEvents(volunteerId: number) {
  return useGetQuery<ApiVolunteerEventN4DGet[]>({
    queryKey: [...REGISTRATIONS_QUERY_KEY, "volunteer", String(volunteerId)],
    apiPath: `${apiPathVolunteer}/${volunteerId}/events`,
  });
}

export function useSetAttended() {
  return useMutationQuery<{ registrationId: number; attended: boolean }, unknown>({
    mutationFn: ({ registrationId, attended }) =>
      mutateData(`${apiPathEventRegistration}/${registrationId}`, "patch", { attended }),
    queryKeyToInvalidate: REGISTRATIONS_QUERY_KEY,
  });
}

export function useRegisterForEvent(onSuccess: () => void) {
  return useMutationQuery<ApiEventN4DRegistrationPost, unknown>({
    apiPath: apiPathEventRegistration,
    onSuccessCallback: onSuccess,
    noToast: true,
  });
}
