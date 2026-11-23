import { TFunction } from "i18next";
import { z } from "zod";

export const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t("dashboard.login.emailMissing"))
      .refine((value) => value.includes("@"), t("dashboard.login.emailMissingAtChar")),
  });

export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
