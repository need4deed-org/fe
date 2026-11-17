import { TypePLZ } from "@/components/forms/types";
import { isSavedPLZ, isValidPLZ } from "@/components/forms/utils";
import { apiPathPostcodeCheck } from "@/config/constants";
import { canSubmitPLZ, fetchPLZExists, PLZCheckStatus, resolvePLZStatus } from "@/utils/plz-check";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const debounceMs = 400;
const unknownStaleMs = 5 * 60 * 1000;

export type PLZCheck = {
  status: PLZCheckStatus;
  blocksSubmit: boolean;
};

type CheckPLZOptions = {
  scope?: TypePLZ;
  savedPLZ?: string;
};

export function useCheckPLZ(plz: string, { scope = TypePLZ.GERMANY, savedPLZ }: CheckPLZOptions = {}): PLZCheck {
  const trimmed = plz.trim();
  const debounced = useDebounce(trimmed, debounceMs);
  const isCandidate = !isSavedPLZ(trimmed, savedPLZ) && isValidPLZ(trimmed, scope);
  const isSettled = debounced === trimmed;

  const { data, isError } = useQuery({
    queryKey: ["postcode-check", isCandidate ? debounced : null],
    queryFn: () => fetchPLZExists(apiPathPostcodeCheck, debounced),
    enabled: isCandidate && isSettled,
    staleTime: ({ state }) => (state.data === false ? unknownStaleMs : Infinity),
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    networkMode: "always",
  });

  const status = resolvePLZStatus({ isCandidate, isSettled, isError, exists: data });
  return { status, blocksSubmit: !canSubmitPLZ(status) };
}
