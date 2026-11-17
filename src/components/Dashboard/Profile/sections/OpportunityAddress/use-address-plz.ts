import { TypePLZ } from "@/components/forms/types";
import { useCheckPLZ } from "@/hooks/use-check-plz";
import { Control, useWatch } from "react-hook-form";
import { OpportunityAddressFormData } from "./opportunityAddressSchema";

export function useAddressPLZ(control: Control<OpportunityAddressFormData>) {
  const [notMyLocation, postcode] = useWatch({ control, name: ["notMyLocation", "postcode"] });
  return useCheckPLZ(notMyLocation ? (postcode ?? "") : "", TypePLZ.GERMANY);
}
