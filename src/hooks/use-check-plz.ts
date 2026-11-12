import { TypePLZ } from "@/components/forms/types";
import { isValidPLZ } from "@/components/forms/utils";
import { canSubmitPLZ, fetchPLZExists, PLZCheckStatus, resolvePLZStatus } from "@/utils/openplz";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const debounceMs = 400;

export type PLZCheck = {
  status: PLZCheckStatus;
  blocksSubmit: boolean;
};

export function useCheckPLZ(plz: string, scope: TypePLZ = TypePLZ.GERMANY): PLZCheck {
  const trimmed = plz.trim();
  const debounced = useDebounce(trimmed, debounceMs);
  const isCandidate = isValidPLZ(trimmed, scope);
  const isSettled = debounced === trimmed;

  const { data, isError } = useQuery({
    queryKey: ["openplz", debounced],
    queryFn: () => fetchPLZExists(debounced),
    enabled: isCandidate && isSettled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  const status = resolvePLZStatus({ isCandidate, isSettled, isError, exists: data });
  return { status, blocksSubmit: !canSubmitPLZ(status) };
}
