import { isBefore, startOfDay, subMonths } from "date-fns";

type Contact = {
  appointmentDate?: Date | null;
  refugeeName?: string;
  refugeeNumber?: string;
};

export const isContactErased = (
  { appointmentDate, refugeeName, refugeeNumber }: Contact,
  today: Date = new Date(),
): boolean =>
  !!appointmentDate &&
  !refugeeName &&
  !refugeeNumber &&
  isBefore(startOfDay(appointmentDate), subMonths(startOfDay(today), 1));
