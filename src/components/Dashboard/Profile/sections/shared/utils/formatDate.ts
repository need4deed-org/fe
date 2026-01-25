import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { format } from "date-fns";

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return EMPTY_PLACEHOLDER_VALUE;
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd.MM.yyyy");
};
