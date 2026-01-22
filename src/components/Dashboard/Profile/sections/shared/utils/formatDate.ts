import { format } from "date-fns";

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "–";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd.MM.yyyy");
};
