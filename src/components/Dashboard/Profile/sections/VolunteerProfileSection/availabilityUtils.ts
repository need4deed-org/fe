import { Availability } from "@/components/forms/types";
import { getScheduleState } from "@/components/forms/utils";
import { Availability as ApiAvailability, ByDay } from "need4deed-sdk";
import { DAY_MAP, REVERSE_DAY_MAP } from "./constants";

export function apiToFormAvailability(apiAvailability: ApiAvailability[]): Availability {
  const formAvailability = getScheduleState();

  apiAvailability.forEach((avail) => {
    const weekdayNum = REVERSE_DAY_MAP[avail.day as string];
    if (!weekdayNum) return;

    const dayIndex = formAvailability.findIndex((d) => d.weekday === weekdayNum);
    if (dayIndex === -1) return;

    if (Array.isArray(avail.daytime) && avail.daytime.length === 2) {
      const [start, end] = avail.daytime;
      const startHour = start.split(":")[0].padStart(2, "0");
      const endHour = end.split(":")[0].padStart(2, "0");
      const timeSlotId = `${startHour}-${endHour}`;

      const slotIndex = formAvailability[dayIndex].timeSlots.findIndex((s) => s.id === timeSlotId);
      if (slotIndex !== -1) {
        formAvailability[dayIndex].timeSlots[slotIndex].selected = true;
      }
    }
  });

  return formAvailability;
}

export // Convert form Availability to backend format
function formToApiAvailability(formAvailability: Availability): Array<{ day: string; daytime: [string, string] }> {
  const result: Array<{ day: string; daytime: [string, string] }> = [];
  const dayEnumToString: Record<ByDay, string> = {
    [ByDay.MO]: "Monday",
    [ByDay.TU]: "Tuesday",
    [ByDay.WE]: "Wednesday",
    [ByDay.TH]: "Thursday",
    [ByDay.FR]: "Friday",
    [ByDay.SA]: "Saturday",
    [ByDay.SU]: "Sunday",
  };
  formAvailability.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (slot.selected && day.weekday >= 1 && day.weekday <= 7) {
        const dayEnum = DAY_MAP[day.weekday];
        const dayString = dayEnumToString[dayEnum];
        const slotId = String(slot.id);
        const [startHourStr, endHourStr] = slotId.split("-");
        const startHourNum = parseInt(startHourStr, 10);
        const endHourNum = parseInt(endHourStr, 10);
        const startTime = `${startHourNum}:00`;
        const endTime = `${endHourNum}:00`;
        result.push({
          day: dayString,
          daytime: [startTime, endTime],
        });
      }
    });
  });
  return result;
}
