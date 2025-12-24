import { TFunction } from "i18next";
import {
  ApiLanguage,
  LangProficiency,
  OpportunityType,
  Option,
  OptionId,
  TranslatedIntoType,
  VolunteerFormData,
} from "need4deed-sdk";

import { getDateLocalTooUTC, parseYesNo, range } from "@/utils";
import { maxPLZBerlin, maxPLZGermany, minPLZBerlin, minPLZGermany } from "../../config/constants";
import { OpportunityData, OpportunityParsedData } from "./AddOpportunity/dataStructure";
import { VolunteerData } from "./BecomeVolunteer/dataStructure";
import { Availability, Selected, TimeSlot, TypePLZ } from "./types";

function getSelectedTimeslots(state: Availability): [number, OptionId][] {
  return state.reduce((result: [number, OptionId][], day) => {
    day.timeSlots
      .filter(({ selected }) => selected)
      .forEach(({ id }) => {
        const numDay = day.weekday;
        result.push([numDay, id]);
      });
    return result;
  }, []);
}

export function getSelectedIds(state: Selected[]): OptionId[] {
  return state.filter(({ selected }) => selected).map(({ id }) => id);
}

export function parseFormStateDTOVolunteer(value: VolunteerData): VolunteerFormData {
  const data = {} as VolunteerFormData;
  data.opportunityId = value.opportunityId ? +value.opportunityId : undefined;
  data.fullName = value.name;
  data.email = value.email;
  data.phone = value.phone;
  data.postcode = Number(value.postcode);
  data.districts = getSelectedIds(value.locations);
  data.activities = getSelectedIds(value.activities);
  data.skills = getSelectedIds(value.skills);
  data.leadFrom = getSelectedIds(value.leadFrom);
  data.schedule = getSelectedTimeslots(value.availability);

  // Languages with proficiency levels
  const levelToProficiency: Record<string, LangProficiency> = {
    native: LangProficiency.NATIVE,
    fluent: LangProficiency.FLUENT,
    intermediate: LangProficiency.INTERMEDIATE,
  };

  data.languages = value.languages
    .filter((lang) => lang.language)
    .map((lang) => ({
      title: lang.language,
      proficiency: levelToProficiency[lang.level] || LangProficiency.INTERMEDIATE,
    })) as ApiLanguage[];

  data.goodConductCertificate = parseYesNo(value.certOfGoodConduct);
  data.measlesVaccination = parseYesNo(value.certMeaslesVaccination);
  data.comments = value.comments;

  return data;
}

export function parseFormStateDTOOpportunity(value: OpportunityData) {
  const data = {} as OpportunityParsedData;
  data.title = value.title;
  data.opportunity_type = value.opportunityType || OpportunityType.GENERAL;
  data.vo_information = value.voInformation;
  data.accomp_address = value.aaAddress;
  data.accomp_postcode = value.aaPostcode;
  data.accomp_datetime = getDateLocalTooUTC(
    value.opportunityType === OpportunityType.ACCOMPANYING ? value.dateTime : value.onetimeDateTime,
  );
  data.accomp_name = value.refugeeName;
  data.accomp_phone = value.refugeeNumber;
  data.accomp_information = value.aaInformation;
  data.accomp_translation = value.translatedInto;
  data.rac_email = value.email;
  data.rac_full_name = value.fullName;
  data.rac_phone = value.racPhone;
  data.rac_address = value.racAddress;
  data.rac_plz = value.racPostcode;
  data.volunteers_number = parseInt(value.numberVolunteers, 10);
  data.berlin_locations = getSelectedIds(value.locations);
  data.languages = value.translatedInto !== TranslatedIntoType.NO_TRANSLATION ? getSelectedIds(value.languages) : [];
  data.activities = getSelectedIds([...value.activities, ...value.activitiesAccompanying]);
  data.skills = getSelectedIds(value.skills);
  data.timeslots = getSelectedTimeslots(value.schedule);
  data.language = value.language;

  return data;
}

export function isValidPLZ(code: string, scope: TypePLZ = TypePLZ.BERLIN) {
  const codeNum = Number(code);

  if (Number.isNaN(codeNum)) return false;

  if (scope === TypePLZ.GERMANY) {
    return codeNum >= minPLZGermany && codeNum <= maxPLZGermany;
  }
  if (scope === TypePLZ.BERLIN) {
    return codeNum >= minPLZBerlin && codeNum <= maxPLZBerlin;
  }
  return false;
}

export function getTickMark(isTicked: boolean) {
  return isTicked ? "☑" : "◻️";
}

export function getDate(datetime: string) {
  return new Date(datetime);
}

export function getScheduleState(): Availability {
  const createTimeSlots = (): Selected[] =>
    Object.values(TimeSlot)
      .filter((timeSlot) => timeSlot !== TimeSlot.WEEKDAYS && timeSlot !== TimeSlot.WEEKENDS)
      .map((timeSlot) => ({
        id: timeSlot,
        title: { en: timeSlot, de: timeSlot },
        selected: false,
      }));
  const schedule: Availability = [];

  for (const weekday of range(1, 8)) {
    schedule.push({ weekday, timeSlots: createTimeSlots() });
  }

  schedule.push({
    weekday: 0,
    timeSlots: [
      {
        id: "weekdays",
        title: { en: "weekdays", de: "wochentage" },
        selected: false,
      },
      {
        id: "weekends",
        title: { en: "weekends", de: "wocheenden" },
        selected: false,
      },
    ],
  });

  return schedule;
}

export function getAllSelectedFalse(list: Option[]): Selected[] {
  return list.map(({ id, title }) => ({
    id,
    title,
    selected: false,
  }));
}

export function getTimeslotTitle(t: TFunction<"translation", undefined>, title: string) {
  if (title === "weekdays" || title === "wochentage") {
    return t(`form.schedule.weekdays`);
  } else if (title === "weekends" || title === "wocheenden") {
    return t(`form.schedule.weekends`);
  }
  return title;
}

export function isTimeSlotSelected(state: Availability) {
  return state
    .map(({ timeSlots }) => timeSlots)
    .flat()
    .some(({ selected }) => selected);
}

export function isSelected<T extends { selected: boolean }>(items: T[], errorMsg: string) {
  return items.some(({ selected }) => selected) ? undefined : errorMsg;
}
