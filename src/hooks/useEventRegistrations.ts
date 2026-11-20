import { apiPathEvent, apiPathEventRegistration, apiPathVolunteer } from "@/config/constants";
import axios from "axios";
import type {
  ApiEventN4DRegistrationListGet,
  ApiEventN4DRegistrationPost,
  ApiVolunteerEventN4DGet,
} from "need4deed-sdk";

import { useGetQuery } from "./useGetQuery";
import { mutateData, useMutationQuery } from "./useMutationQuery";

const REGISTRATIONS_QUERY_KEY = ["event-registrations"];

export function useEventRegistrations(eventId: number) {
  return useGetQuery<ApiEventN4DRegistrationListGet>({
    queryKey: [...REGISTRATIONS_QUERY_KEY, "event", String(eventId)],
    apiPath: `${apiPathEvent}/${eventId}/registrations`,
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
    noToast: true,
  });
}

export function useExportEventRegistrations(eventId: number) {
  return useMutationQuery<void, unknown>({
    mutationFn: async () => {
      const { data } = await axios.get<Blob>(`${apiPathEvent}/${eventId}/registrations/export`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `registrations-event-${eventId}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    noToast: true,
  });
}

export function useRegisterForEvent(onSuccess: () => void) {
  return useMutationQuery<ApiEventN4DRegistrationPost, unknown>({
    apiPath: apiPathEventRegistration,
    onSuccessCallback: onSuccess,
    noToast: true,
  });
}
