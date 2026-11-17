import { TypePLZ } from "@/components/forms/types";
import { useCheckPLZ } from "@/hooks/use-check-plz";
import { Control, useWatch } from "react-hook-form";
import { AccompanyingDetailsFormData } from "./createAccompanyingDetailsSchema";

export function useAppointmentPLZ(control: Control<AccompanyingDetailsFormData>) {
  const postcode = useWatch({ control, name: "appointmentPostcode" });
  return useCheckPLZ(postcode ?? "", TypePLZ.BERLIN);
}
