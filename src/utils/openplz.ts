export const openPlzLocalitiesUrl = "https://openplzapi.org/de/Localities";
export const openPlzTimeoutMs = 3000;

export type PLZCheckStatus = "idle" | "pending" | "known" | "unknown" | "unavailable";

type FetchFn = (input: string, init?: { signal?: AbortSignal }) => Promise<Pick<Response, "ok" | "json">>;

export async function fetchPLZExists(
  plz: string,
  fetchFn: FetchFn = fetch,
  timeoutMs: number = openPlzTimeoutMs,
): Promise<boolean> {
  const url = `${openPlzLocalitiesUrl}?postalCode=${encodeURIComponent(plz)}`;
  const response = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`OpenPLZ responded with an error for ${plz}`);

  const localities: unknown = await response.json();
  if (!Array.isArray(localities)) throw new Error(`OpenPLZ returned an unexpected body for ${plz}`);
  return localities.length > 0;
}

export function canSubmitPLZ(status: PLZCheckStatus): boolean {
  return status !== "unknown" && status !== "pending";
}
