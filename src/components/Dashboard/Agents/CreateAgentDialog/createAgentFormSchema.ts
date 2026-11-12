import { TypePLZ } from "@/components/forms/types";
import { isValidPLZ } from "@/components/forms/utils";
import { z } from "zod";

export const createAgentFormSchema = (t: (key: string) => string) => {
  return z.object({
    title: z.string().min(1, t("dashboard.agents.createAgent.validation.titleRequired")),
    addressStreet: z.string().optional().or(z.literal("")),
    addressPostcode: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((code) => !code?.trim() || isValidPLZ(code, TypePLZ.GERMANY), t("form.error.postcodeGermany")),
  });
};

export type CreateAgentFormData = z.infer<ReturnType<typeof createAgentFormSchema>>;
