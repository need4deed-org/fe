import z from "zod";
import {
  OPPORTUNITY_TITLE_MESSAGES,
  refineTextLimit,
  SOURCE_TEXT_LIMITS,
  Translate,
} from "@/utils/opportunity-text-limits";
import { VolunteerStateTypeType } from "need4deed-sdk";

export const createHeaderSchema = (t: Translate) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t("form.error.required"))
      .superRefine(refineTextLimit(t, SOURCE_TEXT_LIMITS.title, OPPORTUNITY_TITLE_MESSAGES)),
    volunteerType: z.enum(
      [VolunteerStateTypeType.REGULAR, VolunteerStateTypeType.ACCOMPANYING, VolunteerStateTypeType.EVENTS],
      { error: t("form.error.required") },
    ),
    agentId: z.number().min(1, t("form.error.required")),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;
