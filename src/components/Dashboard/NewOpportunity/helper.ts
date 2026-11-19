import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { format } from "date-fns";
import { TFunction } from "i18next";
import {
  OptionItem,
  Lang,
  VolunteerStateTypeType,
  OpportunityLegacyType,
  OpportunityFormDataWithAgentSubmitter,
  ApiOpportunityAddress,
  ApiOpportunityGet,
  ApiLanguage,
  ProfileVolunteeringType,
} from "need4deed-sdk";
import { HeaderFormData } from "./headerSchema";
import { AccompanyingDetailsFormData } from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { NewOpportunityDetailsFormData } from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { languagesToFormValues, resolveFormLanguageToOption } from "../Profile/sections/OpportunityDetails/formatters";
import { apiToFormAvailability } from "../Profile/sections/VolunteerProfile/availabilityUtils";
import { UseFormReturn } from "react-hook-form";
import { formatToLocalTime } from "@/utils";
import { OpportunityAddressFormData } from "../Profile/sections/OpportunityAddress";

interface PopulateDuplicateParams {
  duplicateOpportunity: ApiOpportunityGet;
  headerMethods: UseFormReturn<HeaderFormData>;
  detailsMethods: UseFormReturn<NewOpportunityDetailsFormData>;
  accompanyingMethods: UseFormReturn<AccompanyingDetailsFormData>;
  addressMethods: UseFormReturn<OpportunityAddressFormData>;
  accompanyingInitValues: AccompanyingDetailsFormData;
  currentEventDateTime: Date | null;
  generalLangs: ApiLanguage[] | undefined;
  residentsLangs: ApiLanguage[] | undefined;
  duplicateOpportunityAddress: OpportunityAddressFormData | undefined;
  t: TFunction<"translation", undefined>;
}

export type ALLOWED_VOLUNTEER_TYPES =
  | ProfileVolunteeringType.ACCOMPANYING
  | ProfileVolunteeringType.REGULAR
  | ProfileVolunteeringType.EVENTS
  | undefined;

export function toLangOptionItems(
  formLangs: { language: string }[],
  apiLanguages: ApiLanguageOption[],
  t: TFunction,
): OptionItem[] {
  return formLangs.flatMap(({ language }) => {
    const found = resolveFormLanguageToOption(language, apiLanguages, t);
    return found ? [{ id: found.id, title: found.title }] : [];
  });
}

export function toOptionItems(ids: string[], apiItems: ApiLanguageOption[]): OptionItem[] {
  const map = new Map(apiItems.map((i) => [i.id, i.title]));
  return ids.flatMap((id) => {
    const numId = Number(id);
    const title = map.get(numId);
    return title ? [{ id: numId, title }] : [];
  });
}

export function availabilityToTimeslots(
  availability: NewOpportunityDetailsFormData["availability"],
): [number, string][] {
  return (availability ?? []).flatMap(({ weekday, timeSlots }) =>
    timeSlots
      .filter((ts) => ts.selected)
      .map((ts) => {
        const slotId = weekday === 0 ? ts.id.charAt(0).toUpperCase() + ts.id.slice(1) : ts.id;
        return [weekday, slotId] as [number, string];
      }),
  );
}

export function buildCreatePayload(
  headerData: HeaderFormData,
  detailsData: NewOpportunityDetailsFormData,
  accompData: AccompanyingDetailsFormData | null,
  apiLanguages: ApiLanguageOption[],
  apiActivities: ApiLanguageOption[],
  apiSkills: ApiLanguageOption[],
  lang: string,
  t: TFunction,
  agentId: number,
  address: ApiOpportunityAddress | null = null,
): OpportunityFormDataWithAgentSubmitter {
  const isEvent = headerData.volunteerType === VolunteerStateTypeType.EVENTS;
  const isAccompanying = headerData.volunteerType === VolunteerStateTypeType.ACCOMPANYING;

  const mainLangIds = isAccompanying
    ? []
    : toLangOptionItems(detailsData.mainCommunication, apiLanguages, t).map((i) => i.id);

  const residentsLangIds = isAccompanying
    ? []
    : toLangOptionItems(detailsData.residentsSpeak, apiLanguages, t).map((i) => i.id);

  const refugeeLangIds = isAccompanying
    ? (accompData?.refugeeLanguage ?? []).map(Number).filter((id) => !isNaN(id))
    : [];

  const languageIds = [...new Set([...mainLangIds, ...residentsLangIds, ...refugeeLangIds])];

  const activityIds = toOptionItems(detailsData.activities, apiActivities).map((i) => i.id);
  const skillIds = toOptionItems(detailsData.skills, apiSkills).map((i) => i.id);
  const timeslots = isEvent ? undefined : availabilityToTimeslots(detailsData.availability);

  const onetime_date_time =
    isEvent && detailsData.eventDate
      ? `${format(detailsData.eventDate, "yyyy-MM-dd")}T${detailsData.eventTime || "00:00"}:00`
      : undefined;

  const accomp_datetime =
    isAccompanying && accompData?.appointmentDate
      ? `${format(accompData.appointmentDate, "yyyy-MM-dd")}T${accompData.appointmentTime || "00:00"}:00`
      : undefined;

  return {
    title: headerData.title.trim(),
    opportunity_type: isAccompanying ? OpportunityLegacyType.ACCOMPANYING : OpportunityLegacyType.VOLUNTEERING,
    vo_information: detailsData.description.trim() || undefined,
    volunteers_number: Number(detailsData.numberOfVolunteers) || 1,
    languageIds,
    activityIds,
    skillIds,
    timeslots,
    onetime_date_time,
    accomp_address: isAccompanying ? (accompData?.appointmentAddress ?? undefined) : undefined,
    accomp_postcode: isAccompanying ? (accompData?.appointmentPostcode ?? undefined) : undefined,
    accomp_datetime,
    accomp_name: isAccompanying ? (accompData?.refugeeName ?? undefined) : undefined,
    accomp_phone: isAccompanying ? (accompData?.refugeeNumber ?? undefined) : undefined,
    accomp_information: undefined,
    accomp_translation: isAccompanying ? accompData?.appointmentLanguage || undefined : undefined,
    districtIds: undefined,
    address: address ?? undefined,
    category: "",
    category_id: "",
    language: lang as `${Lang}`,
    agent_id: agentId,
    submitted_by_id: undefined,
    last_edited_time_notion: undefined,
  };
}

export const languageToIsoCode = (language: string): Lang | undefined => {
  if (language === "Deutsch" || language === "German") return Lang.DE;
  if (language === "English" || language === "Englisch") return Lang.EN;
  return undefined;
};
export const isoCodeToLanguage = (isoCode: Lang | undefined, lang: string) => {
  if (isoCode === "de" && lang === "de") return "Deutsch";
  if (isoCode === "de" && lang === "en") return "German";
  if (isoCode === "en" && lang === "en") return "English";
  if (isoCode === "en" && lang === "de") return "Englisch";
  return "";
};

export const populateDuplicateOpportunity = ({
  duplicateOpportunity,
  headerMethods,
  detailsMethods,
  accompanyingMethods,
  addressMethods,
  accompanyingInitValues,
  currentEventDateTime,
  generalLangs,
  residentsLangs,
  duplicateOpportunityAddress,
  t,
}: PopulateDuplicateParams) => {
  headerMethods.reset({
    title: duplicateOpportunity.title ?? "",
    volunteerType: (duplicateOpportunity.volunteerType as ALLOWED_VOLUNTEER_TYPES) ?? undefined,
    agentId: duplicateOpportunity.agentId ?? 0,
  });

  detailsMethods.reset({
    description: String(duplicateOpportunity.description ?? ""),
    numberOfVolunteers: String(duplicateOpportunity.numberOfVolunteers ?? 1),
    mainCommunication: languagesToFormValues(generalLangs ?? [], t) ?? [{ id: 1, language: "", level: "" }],
    residentsSpeak: languagesToFormValues(residentsLangs ?? [], t) ?? [{ id: 1, language: "", level: "" }],
    availability: apiToFormAvailability(duplicateOpportunity.availability) ?? [],
    eventDate: currentEventDateTime ? currentEventDateTime : null,
    eventTime: currentEventDateTime ? formatToLocalTime(currentEventDateTime) : "",
    activities: duplicateOpportunity.activities.map((act) => String(act.id)) ?? [],
    skills: duplicateOpportunity.skills.map((skill) => String(skill.id)) ?? [],
  });

  if (accompanyingInitValues) {
    accompanyingMethods.reset({
      appointmentAddress: accompanyingInitValues.appointmentAddress ?? "",
      appointmentPostcode: accompanyingInitValues.appointmentPostcode ?? "",
      appointmentDate: null,
      appointmentTime: "",
      refugeeNumber: "",
      refugeeName: "",
      refugeeLanguage: accompanyingInitValues.refugeeLanguage ?? [],
      appointmentLanguage: accompanyingInitValues.appointmentLanguage ?? undefined,
    });
  }

  if (duplicateOpportunityAddress) {
    addressMethods.reset(duplicateOpportunityAddress);
  }
};
