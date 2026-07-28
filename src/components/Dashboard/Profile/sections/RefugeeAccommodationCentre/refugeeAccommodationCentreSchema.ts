import { z } from "zod";

export const createRefugeeAccommodationCentreSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.rac.validation.nameRequired")),
  });
};

export type RefugeeAccommodationCentreFormData = z.infer<ReturnType<typeof createRefugeeAccommodationCentreSchema>>;
