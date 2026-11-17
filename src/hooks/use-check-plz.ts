import { TypePLZ } from "@/components/forms/types";
import { isValidPLZ } from "@/components/forms/utils";
import { apiPathPostcodeCheck } from "@/config/constants";
import { canSubmitPLZ, fetchPLZExists, PLZCheckStatus, resolvePLZStatus } from "@/utils/plz-check";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const debounceMs = 400;

export type PLZCheck = {
  status: PLZCheckStatus;
  blocksSubmit: boolean;
};

export function useCheckPLZ(plz: string, scope: TypePLZ = TypePLZ.GERMANY, savedPLZ?: string): PLZCheck {
  const trimmed = plz.trim();
  const isUnchanged = savedPLZ !== undefined && trimmed === savedPLZ.trim();
  const debounced = useDebounce(trimmed, debounceMs);
  const isCandidate = !isUnchanged && isValidPLZ(trimmed, scope);
  const isSettled = debounced === trimmed;

  const { data, isError } = useQuery({
    queryKey: ["postcode-check", debounced],
    queryFn: () => fetchPLZExists(apiPathPostcodeCheck, debounced),
    enabled: isCandidate && isSettled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const status = resolvePLZStatus({ isCandidate, isSettled, isError, exists: data });
  return { status, blocksSubmit: !canSubmitPLZ(status) };
}
