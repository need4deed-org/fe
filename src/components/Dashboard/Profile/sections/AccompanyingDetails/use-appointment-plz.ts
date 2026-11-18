import { TypePLZ } from "@/components/forms/types";
import { usePLZField } from "@/hooks/use-plz-field";
import { Control } from "react-hook-form";
import { AccompanyingDetailsFormData } from "./createAccompanyingDetailsSchema";

export function useAppointmentPLZ(control: Control<AccompanyingDetailsFormData>) {
  return usePLZField(control, "appointmentPostcode", { scope: TypePLZ.BERLIN });
}
