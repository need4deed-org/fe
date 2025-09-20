export * from "./helpers";

import { cloudfrontURL } from "@/config/constants";
import { DocumentStatusType } from "need4deed-sdk";

export function getDateLocalTooUTC(dateStr: string | undefined) {
  if (!dateStr) return undefined;

  return new Date(dateStr).toISOString();
}

export function haveCommonElements(...arrays: Array<Array<unknown>>) {
  const combined = new Set(arrays.flat()); // Flatten and put all in a Set
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  return combined.size < totalLength;
}

export function parseYesNo(value: boolean | undefined): DocumentStatusType {
  if (value) return DocumentStatusType.YES;
  return DocumentStatusType.NO;
}

export function* range(start: number, end: number, step = 1) {
  if (typeof start !== "number" || typeof end !== "number" || typeof step !== "number") {
    throw new TypeError("Start, end, and step must be numbers.");
  }

  if (step === 0 || !Number.isInteger(step)) {
    throw new RangeError("Step has to be non zero integer.");
  }

  function isWithinRange(value: number) {
    if (step > 0) return value < end;
    return value > end;
  }

  for (let i = start; isWithinRange(i); i += step) {
    yield i;
  }
}

export function fetchFn<R, D = R>({
  url,
  options,
  fnDTO,
}: {
  url: string;
  options?: RequestInit;
  fnDTO?: (data: R) => D;
}): Promise<D> {
  const defaultOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
  };

  return fetch(url, { ...defaultOptions, ...options })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then((data) => {
      return fnDTO ? fnDTO(data) : data;
    });
}

export const getImageUrl = (imageName: string): string => {
  return `${cloudfrontURL}/${imageName}`;
};
