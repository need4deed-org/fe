import { TypePLZ } from "@/components/forms/types";
import { Control, FieldValues, get, Path, useFormState, useWatch } from "react-hook-form";
import { PLZCheck, useCheckPLZ } from "./use-check-plz";

type PLZFieldOptions = {
  scope?: TypePLZ;
  enabled?: boolean;
};

export function usePLZField<T extends FieldValues>(
  control: Control<T>,
  name: Path<T>,
  { scope, enabled = true }: PLZFieldOptions = {},
): PLZCheck {
  const postcode: string | undefined = useWatch({ control, name });
  const { defaultValues } = useFormState({ control });
  const savedPLZ: string | undefined = get(defaultValues, name);
  return useCheckPLZ(enabled ? (postcode ?? "") : "", { scope, savedPLZ });
}
