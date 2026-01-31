import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const accompanyingDetailsSchema = z.object({
  appointmentAddress: z.string().optional(),
  appointmentDate: z.date().nullable().optional(),
  appointmentTime: z
    .string()
    .optional()
    .refine((val) => !val || timeRegex.test(val), {
      message: "invalidTimeFormat",
    }),
  refugeeNumber: z.string().optional(),
  refugeeName: z.string().optional(),
  languagesToTranslate: z.array(z.string()).optional(),
});

export type AccompanyingDetailsFormData = z.infer<typeof accompanyingDetailsSchema>;
