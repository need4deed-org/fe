import { TFunction } from "i18next";
import { z } from "zod";

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t("dashboard.login.emailMissing"))
      .refine((value) => value.includes("@"), t("dashboard.login.emailMissingAtChar")),
    password: z.string().min(1, t("dashboard.login.passwordMissing")),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
