import { PHONE_NUMBER_REGEX } from "@/config/constants";
import { z } from "zod";

const i18nPrefix = "dashboard.organizationProfile.contactDetails.validation";

export const createOrganizationContactDetailsSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .refine((val) => !val || z.email().safeParse(val).success, {
        message: t(`${i18nPrefix}.emailInvalid`),
      }),
    phone: z
      .string()
      .trim()
      .refine((val) => !val || (val.length >= 7 && val.length <= 20 && PHONE_NUMBER_REGEX.test(val)), {
        message: t(`${i18nPrefix}.phoneInvalid`),
      }),
  });

export type OrganizationContactDetailsFormData = z.infer<ReturnType<typeof createOrganizationContactDetailsSchema>>;
