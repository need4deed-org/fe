import z from "zod";
import { VolunteerStateTypeType } from "need4deed-sdk";
import { ALLOWED_VOLUNTEER_TYPES } from "./helper";

export const createHeaderSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("form.error.required")),
    volunteerType: z
      .enum(VolunteerStateTypeType)
      .refine((val) => ALLOWED_VOLUNTEER_TYPES.includes(val), { message: t("form.error.required") }),
    agentId: z.number().min(1, t("form.error.required")),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;
