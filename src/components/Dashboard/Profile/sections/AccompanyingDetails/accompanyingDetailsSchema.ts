import { z } from "zod";

export const accompanyingDetailsSchema = z.object({
  appointmentAddress: z.string().optional(),
  refugeeNumber: z.string().optional(),
  refugeeName: z.string().optional(),
  languagesToTranslate: z.array(z.string()).optional(),
});

export type AccompanyingDetailsFormData = z.infer<typeof accompanyingDetailsSchema>;
