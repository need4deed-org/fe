import z from "zod";
import { textLength } from "@/utils/opportunity-text-limits";
import { OPPORTUNITY_TITLE_MAX_LENGTH, VolunteerStateTypeType } from "need4deed-sdk";

export const createHeaderSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(1, t("form.error.required"))
      .refine(
        (value) => textLength(value) <= OPPORTUNITY_TITLE_MAX_LENGTH,
        t("dashboard.opportunityProfile.opportunityDetails.validation.opportunityNameTooLong"),
      ),
    volunteerType: z.enum(
      [VolunteerStateTypeType.REGULAR, VolunteerStateTypeType.ACCOMPANYING, VolunteerStateTypeType.EVENTS],
      { error: t("form.error.required") },
    ),
    agentId: z.number().min(1, t("form.error.required")),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;
