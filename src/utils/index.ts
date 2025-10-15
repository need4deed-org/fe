export * from "./helpers";

import { cloudfrontURL } from "@/config/constants";
import { Address, DocumentStatusType } from "need4deed-sdk";

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

export function formatDateTime(input: string | Date | undefined): string | undefined {
  if (!input) return undefined;

  let date: Date;

  if (typeof input === "string") {
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date string provided.");
    }
    date = parsedDate;
  } else if (input instanceof Date) {
    date = input;
  } else {
    throw new TypeError("Input must be a string or Date.");
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("en-US", options);
}

export const formatAddress = (address?: Address): string => {
  if (!address) return "-";
  const { street, city, postcode } = address;
  const parts = [street?.trim(), city?.trim(), postcode?.code?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "-";
};
