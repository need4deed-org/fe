import { TypePLZ } from "@/components/forms/types";
import { isEmptyOrValidPLZ } from "@/components/forms/utils";
import { textLength } from "@/utils/opportunity-text-limits";
import { ORGANIZATION_ABOUT_MAX_LENGTH } from "need4deed-sdk";
import { z } from "zod";

const urlRegex = /^https?:\/\/.+/;
const i18nPrefix = "dashboard.organizationProfile.organisationDetails.validation";

export const createOrganizationDetailsSchema = (
  t: (key: string, options?: Record<string, unknown>) => string,
  savedPostcode?: string,
  savedWebsite?: string,
  savedAbout?: string,
) => {
  const required = t(`${i18nPrefix}.required`);
  const aboutAllowance = Math.max(ORGANIZATION_ABOUT_MAX_LENGTH, textLength(savedAbout));
  const trimmedSavedWebsite = savedWebsite?.trim() ?? "";

  return z
    .object({
      title: z.string().trim().min(1, required),
      about: z.string().refine((val) => textLength(val) <= aboutAllowance, {
        message: t(`${i18nPrefix}.aboutMaxLength`, { max: aboutAllowance }),
      }),
      website: z
        .string()
        .trim()
        .refine((val) => !val || (trimmedSavedWebsite && val === trimmedSavedWebsite) || urlRegex.test(val), {
          message: t(`${i18nPrefix}.websiteInvalid`),
        }),
      addressStreet: z.string(),
      addressPostcode: z
        .string()
        .refine((code) => isEmptyOrValidPLZ(code, TypePLZ.GERMANY, savedPostcode), t("form.error.postcodeGermany")),
    })
    .superRefine(({ addressStreet, addressPostcode }, ctx) => {
      if (addressStreet.trim() && !addressPostcode.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["addressPostcode"],
          message: t(`${i18nPrefix}.postcodeRequiredWithStreet`),
        });
      }
    });
};

export type OrganizationDetailsFormData = z.infer<ReturnType<typeof createOrganizationDetailsSchema>>;
