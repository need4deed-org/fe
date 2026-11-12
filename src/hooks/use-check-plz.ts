import { TypePLZ } from "@/components/forms/types";
import { isValidPLZ } from "@/components/forms/utils";
import { fetchPLZExists, PLZCheckStatus } from "@/utils/openplz";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const debounceMs = 400;

export function useCheckPLZ(plz: string, scope: TypePLZ = TypePLZ.GERMANY): PLZCheckStatus {
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

  if (!isCandidate) return "idle";
  if (!isSettled) return "pending";
  if (isError) return "unavailable";
  if (data === undefined) return "pending";
  return data ? "known" : "unknown";
}
