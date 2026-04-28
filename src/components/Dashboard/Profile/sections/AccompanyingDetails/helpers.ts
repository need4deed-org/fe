import { ApiOpportunityAccompanyingDetails, VolunteerStateTypeType } from "need4deed-sdk";
import { AccompanyingDetailsFormData } from "./accompanyingDetailsSchema";

export const isAccompanyingType = (volunteerType: VolunteerStateTypeType | undefined): boolean => {
  return (
    volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
    volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING
  );
};

export const getMinAppointmentDate = (): Date => {
  const date = new Date();
  let weekdaysAdded = 0;
  while (weekdaysAdded < 7) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdaysAdded++;
    }
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

export const parseDate = (date: Date | string | undefined): Date | null => {
  if (!date) return null;
  const parsed = date instanceof Date ? date : new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const parseTime = (time: Date | string | undefined): string => {
  if (!time) return "";
  if (typeof time === "string") return time;
  return time.toTimeString().slice(0, 5);
};

// Converts a UTC HH:mm string from the API to the browser's local time for display only.
// Do NOT use this for form state — it would cause the time to shift on every save.
export const formatTimeForDisplay = (time: string | undefined): string => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const getInitialFormValues = (
  details: ApiOpportunityAccompanyingDetails | undefined,
): AccompanyingDetailsFormData => ({
  appointmentAddress: details?.appointmentAddress || "",
  appointmentPostcode:
    (details as ApiOpportunityAccompanyingDetails & { appointmentPostcode?: string })?.appointmentPostcode || "",
  appointmentDistrict:
    (details as ApiOpportunityAccompanyingDetails & { appointmentDistrict?: string })?.appointmentDistrict || "",
  appointmentDate: parseDate(details?.appointmentDate),
  appointmentTime: parseTime(details?.appointmentTime),
  refugeeNumber: details?.refugeeNumber || "",
  refugeeName: details?.refugeeName || "",
  languagesToTranslate: details?.languageToTranslate !== undefined ? [details.languageToTranslate.toString()] : [],
  appointmentLanguage:
    (details as ApiOpportunityAccompanyingDetails & { appointmentLanguage?: string })?.appointmentLanguage || "",
});
