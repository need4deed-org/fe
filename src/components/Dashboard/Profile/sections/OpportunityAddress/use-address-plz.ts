import { TypePLZ } from "@/components/forms/types";
import { useCheckPLZ } from "@/hooks/use-check-plz";
import { Control, useFormState, useWatch } from "react-hook-form";
import { OpportunityAddressFormData } from "./opportunityAddressSchema";

export function useAddressPLZ(control: Control<OpportunityAddressFormData>) {
  const [notMyLocation, postcode] = useWatch({ control, name: ["notMyLocation", "postcode"] });
  const { defaultValues } = useFormState({ control });
  return useCheckPLZ(notMyLocation ? (postcode ?? "") : "", TypePLZ.GERMANY, defaultValues?.postcode ?? "");
}
