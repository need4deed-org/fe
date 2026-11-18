import { TypePLZ } from "@/components/forms/types";
import { isSavedPLZ, isValidPLZ } from "@/components/forms/utils";
import { apiPathPostcodeCheck } from "@/config/constants";
import { canSubmitPLZ, fetchPLZExists, PLZCheckStatus, resolvePLZStatus } from "@/utils/plz-check";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const debounceMs = 400;
const unknownStaleMs = 5 * 60 * 1000;

const queryKey = (plz: string | null) => ["postcode-check", plz];

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
  const isCached = useQueryClient().getQueryData<boolean>(queryKey(trimmed)) !== undefined;
  const isSettled = debounced === trimmed || isCached;
  const lookedUp = isCached ? trimmed : debounced;

  const { data, isError, isFetching } = useQuery({
    queryKey: queryKey(isCandidate ? lookedUp : null),
    queryFn: () => fetchPLZExists(apiPathPostcodeCheck, lookedUp),
    enabled: isCandidate && isSettled,
    staleTime: ({ state }) => (state.data === false ? unknownStaleMs : Infinity),
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    networkMode: "always",
  });

  const status = resolvePLZStatus({ isCandidate, isSettled, isError, isFetching, exists: data });
  return { status, blocksSubmit: !canSubmitPLZ(status) };
}
