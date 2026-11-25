import { TFunction } from "i18next";
import { z } from "zod";

export const createLoginEmailSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t("dashboard.login.emailMissing"))
    .refine((value) => value.includes("@"), t("dashboard.login.emailMissingAtChar"));

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: createLoginEmailSchema(t),
    password: z.string().min(1, t("dashboard.login.passwordMissing")),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
