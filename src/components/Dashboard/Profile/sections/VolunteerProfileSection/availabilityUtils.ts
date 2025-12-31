import { Availability } from "@/components/forms/types";
import { getScheduleState } from "@/components/forms/utils";
import { ApiAvailability } from "need4deed-sdk";
import { DAY_MAP, DAY_ENUM_TO_STRING, REVERSE_DAY_MAP } from "./constants";

export function apiToFormAvailability(apiAvailability: ApiAvailability[]): Availability {
  const formAvailability = getScheduleState();

  apiAvailability.forEach((avail) => {
    const weekdayNum = REVERSE_DAY_MAP[avail.day as string];
    if (!weekdayNum || !avail.daytime) return;

    const dayIndex = formAvailability.findIndex((d) => d.weekday === weekdayNum);
    if (dayIndex === -1) return;

    const timeSlotId = String(avail.daytime);
    const slotIndex = formAvailability[dayIndex].timeSlots.findIndex((s) => s.id === timeSlotId);
    if (slotIndex !== -1) {
      formAvailability[dayIndex].timeSlots[slotIndex].selected = true;
    }
  });

  return formAvailability;
}

export function formToApiAvailability(formAvailability: Availability): Array<{ day: string; daytime: string }> {
  const result: Array<{ day: string; daytime: string }> = [];

  formAvailability.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (slot.selected && day.weekday >= 1 && day.weekday <= 7) {
        const dayEnum = DAY_MAP[day.weekday];
        const slotId = String(slot.id);

        result.push({
          day: DAY_ENUM_TO_STRING[dayEnum],
          daytime: slotId,
        });
      }
    });
  });

  return result;
}
