import { z } from "zod";
import { Availability } from "@/components/forms/types";

export const createVolunteerProfileSchema = (t: (key: string) => string) => {
  return z.object({
    languages: z.string().min(1, t("dashboard.volunteerProfile.profileSection.validation.languagesRequired")),
    availability: z.custom<Availability>((data) => {
      if (!Array.isArray(data)) return false;
      return data.some(day => day.timeSlots.some((slot: { selected: boolean }) => slot.selected));
    }, t("dashboard.volunteerProfile.profileSection.validation.availabilityRequired")),
    districts: z.string().min(1, t("dashboard.volunteerProfile.profileSection.validation.districtsRequired")),
    volunteerType: z.string().min(1, t("dashboard.volunteerProfile.profileSection.validation.volunteerTypeRequired")),
    activities: z.array(z.string()).min(1, t("dashboard.volunteerProfile.profileSection.validation.activitiesRequired")),
    skills: z.array(z.string()).min(1, t("dashboard.volunteerProfile.profileSection.validation.skillsRequired")),
  });
};

export type VolunteerProfileFormData = z.infer<ReturnType<typeof createVolunteerProfileSchema>>;
