import { usePLZField } from "@/hooks/use-plz-field";
import { Control, useWatch } from "react-hook-form";
import { OpportunityAddressFormData } from "./opportunityAddressSchema";

export function useAddressPLZ(control: Control<OpportunityAddressFormData>) {
  const notMyLocation = useWatch({ control, name: "notMyLocation" });
  return usePLZField(control, "postcode", { enabled: notMyLocation });
}
