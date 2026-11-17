import axios from "axios";
import { ApiPostcodeCheck } from "need4deed-sdk";

export const plzCheckTimeoutMs = 3000;

export type PLZCheckStatus = "idle" | "pending" | "known" | "unknown" | "unavailable";

type GetFn = (
  url: string,
  config: { params: { code: string }; timeout: number },
) => Promise<{ data: { data?: Partial<ApiPostcodeCheck> } }>;

export async function fetchPLZExists(
  apiPath: string,
  plz: string,
  getFn: GetFn = axios.get,
  timeoutMs: number = plzCheckTimeoutMs,
): Promise<boolean> {
  const response = await getFn(apiPath, { params: { code: plz }, timeout: timeoutMs });
  const known = response.data.data?.known;
  if (typeof known !== "boolean") throw new Error(`Postcode check returned an unexpected body for ${plz}`);
  return known;
}

type PLZLookupState = {
  isCandidate: boolean;
  isSettled: boolean;
  isError: boolean;
  exists?: boolean;
};

export function resolvePLZStatus({ isCandidate, isSettled, isError, exists }: PLZLookupState): PLZCheckStatus {
  if (!isCandidate) return "idle";
  if (!isSettled) return "pending";
  if (isError) return "unavailable";
  if (exists === undefined) return "pending";
  return exists ? "known" : "unknown";
}

export function canSubmitPLZ(status: PLZCheckStatus): boolean {
  return status !== "unknown" && status !== "pending";
}
