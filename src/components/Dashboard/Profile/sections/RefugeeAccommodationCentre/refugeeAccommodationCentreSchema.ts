import { z } from "zod";

export const createRefugeeAccommodationCentreSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.rac.validation.nameRequired")),
    address: z.string().min(1, t("dashboard.opportunityProfile.rac.validation.addressRequired")),
    district: z.string().min(1, t("dashboard.opportunityProfile.rac.validation.districtRequired")),
  });
};

export type RefugeeAccommodationCentreFormData = z.infer<ReturnType<typeof createRefugeeAccommodationCentreSchema>>;
