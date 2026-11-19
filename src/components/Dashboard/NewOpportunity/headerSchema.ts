import z from "zod";
import { refineTextLimit } from "../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { SOURCE_TEXT_LIMITS } from "@/utils/opportunity-text-limits";
import { VolunteerStateTypeType } from "need4deed-sdk";

export const createHeaderSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    title: z
      .string()
      .min(1, t("form.error.required"))
      .superRefine(
        refineTextLimit(
          t,
          SOURCE_TEXT_LIMITS.title,
          "dashboard.opportunityProfile.opportunityDetails.validation.opportunityNameTooLong",
        ),
      ),
    volunteerType: z.enum(
      [VolunteerStateTypeType.REGULAR, VolunteerStateTypeType.ACCOMPANYING, VolunteerStateTypeType.EVENTS],
      { error: t("form.error.required") },
    ),
    agentId: z.number().min(1, t("form.error.required")),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;
