import { TypePLZ } from "@/components/forms/types";
import { useCheckPLZ } from "@/hooks/use-check-plz";
import { Control, useFormState, useWatch } from "react-hook-form";
import { AccompanyingDetailsFormData } from "./createAccompanyingDetailsSchema";

export function useAppointmentPLZ(control: Control<AccompanyingDetailsFormData>) {
  const postcode = useWatch({ control, name: "appointmentPostcode" });
  const { defaultValues } = useFormState({ control });
  return useCheckPLZ(postcode ?? "", { scope: TypePLZ.BERLIN, savedPLZ: defaultValues?.appointmentPostcode });
}
