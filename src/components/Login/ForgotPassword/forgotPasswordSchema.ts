import { TFunction } from "i18next";
import { z } from "zod";
import { createLoginEmailSchema } from "../Login/loginSchema";

export const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: createLoginEmailSchema(t),
  });

export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
