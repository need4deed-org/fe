import { TFunction } from "i18next";
import { Lang } from "need4deed-sdk";

import { Availability } from "../types/availabilityTypes";
import style from "../index.module.css";

type Props = {
  availability: Availability;
  onChange: (newAvailability: Availability) => void;
  onFocus?: () => void;
  header: string;
  t: TFunction<"translation", undefined>;
  currentLanguage: Lang;
};

const getTimeslotTitle = (t: TFunction<"translation", undefined>, title: string) => {
  if (title === "weekdays" || title === "wochentage") {
    return t("form.schedule.weekdays");
  } else if (title === "weekends" || title === "wocheenden") {
    return t("form.schedule.weekends");
  }
  return title;
};

export function AvailabilityGrid({ availability, onChange, onFocus, header, t, currentLanguage }: Props) {
  const handleTimeslotChange = (weekdayIndex: number, timeslotIndex: number, checked: boolean) => {
    const newAvailability = availability.map((availabilityObj, idx) => {
      if (idx !== weekdayIndex) return availabilityObj;

      return {
        ...availabilityObj,
        timeSlots: availabilityObj.timeSlots.map((slot, slotIdx) =>
          slotIdx === timeslotIndex ? { ...slot, selected: checked } : slot,
        ),
      };
    });

    onChange(newAvailability);
  };

  return (
    <div className={style["form-table-wrapper"]} data-testid="availability-grid">
      <h3>{header}</h3>
      <div className={style["form-table"]} onFocus={onFocus}>
        {availability.map((availabilityObj, weekdayIndex) => (
          <div className={style["form-table-row"]} key={`availability-${availabilityObj.weekday}`}>
            <span className={style["form-availability-weekday"]}>
              {t(`form.schedule.${availabilityObj.weekday}`).toLocaleUpperCase()}
            </span>
            {availabilityObj.timeSlots.map(({ title, id, selected }, timeslotIndex) => (
              <TimeSlot
                key={`${availabilityObj.weekday}-${id}`}
                id={`${availabilityObj.weekday}${id}`}
                title={getTimeslotTitle(t, title[currentLanguage] as string)}
                checked={selected}
                onChange={(checked) => handleTimeslotChange(weekdayIndex, timeslotIndex, checked)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type TimeSlotProps = {
  id: string;
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function TimeSlot({ id, title, checked, onChange }: TimeSlotProps) {
  return (
    <span className={style["form-pick"]} data-testid={`timeslot-${id}`}>
      <input tabIndex={0} id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label htmlFor={id}>{title}</label>
    </span>
  );
}
