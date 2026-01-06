import { Lang, OpportunityType, TranslatedIntoType } from "need4deed-sdk";

import { TFunction } from "i18next";
import { Opportunity, OpportunityApi } from "./tempTypes";

export enum IconName {
  ChatsTeardrop = "chatsTeardrop",
  Baby = "baby",
  Bicycle = "bicycle",
  CalendarStar = "calendarStar",
  PingPong = "pingPong",
  Users = "users",
  Sparkle = "sparkle",
}

export enum CategoryTitle {
  ACCOMPANYING = 6,
  SPORT_ACTIVITIES = 5,
  EVENTS = 4,
  SKILLS_BASED = 3,
  CHILD_CARE = 2,
  DE_LNG_SUPPORT = 1,
}

const mapOpportunity = (opp: OpportunityApi, t: TFunction) => {
  const accompanyingTranslationMap = {
    [TranslatedIntoType.ENGLISH_OK]: t("dashboard.opportunities.accompanyingTranslation.en"),
    [TranslatedIntoType.DEUTSCHE]: t("dashboard.opportunities.accompanyingTranslation.de"),
    [TranslatedIntoType.NO_TRANSLATION]: t("dashboard.opportunities.accompanyingTranslation.no"),
  };

  const defaultMainCommunication = t("dashboard.opportunities.defaultMainCommunication");

  const otherCategory = t("dashboard.opportunities.otherCategory");

  const category =
    (opp.category_id === CategoryTitle.ACCOMPANYING && opp.opportunity_type === OpportunityType.GENERAL) ||
    !opp.category
      ? otherCategory
      : opp.category;

  const newOpp: Opportunity = {
    accompanyingDate: opp.accomp_datetime ? new Date(opp.accomp_datetime) : null,
    accompanyingInfo: opp.accomp_information,
    accompanyingTranslation: accompanyingTranslationMap[opp.accomp_translation || TranslatedIntoType.NO_TRANSLATION],
    activities: opp.activities,
    createdAt: new Date(opp.created_at),
    datetime: opp.datetime_str,
    id: opp.id,
    languages: opp.languages,
    locations: opp.berlin_locations,
    opportunityType: opp.opportunity_type,
    schedule: opp.schedule_str,
    skills: opp.skills,
    status: opp.status,
    timeslots: opp.timeslots,
    title: opp.title,
    updatedAt: new Date(opp.updated_at),
    voInformation: opp.vo_information,
    categoryId: opp.category_id,
    lastEditedTimeNotion: new Date(opp.last_edited_time_notion),
    defaultMainCommunication,
    category,
  };

  return newOpp;
};

export const getMappedOpportunities = (opps: OpportunityApi[], t: TFunction) => {
  return opps.map((opp) => mapOpportunity(opp, t));
};

export function getIconName(category: CategoryTitle) {
  const categoryIconMap = {
    [CategoryTitle.ACCOMPANYING]: IconName.Users,
    [CategoryTitle.SPORT_ACTIVITIES]: IconName.PingPong,
    [CategoryTitle.EVENTS]: IconName.CalendarStar,
    [CategoryTitle.SKILLS_BASED]: IconName.Bicycle,
    [CategoryTitle.CHILD_CARE]: IconName.Baby,
    [CategoryTitle.DE_LNG_SUPPORT]: IconName.ChatsTeardrop,
  };

  return category in categoryIconMap ? categoryIconMap[category] : IconName.Sparkle;
}

const aubergineColorActivities = [
  "doctors appointment",
  "government office",
  "apartment viewing",
  "school/kindergarten",
  "way/path accompanying",
  "accompanying",
  "arzttermine",
  "behörde",
  "wohnungsbesichtigung",
  "schule/kindergarten",
  "wegbegleitung",
  "begleitung",
];

export const getActivityBackgroundColor = (activity: string) => {
  return aubergineColorActivities.includes(activity.toLowerCase())
    ? "var(--color-aubergine-light)"
    : "var(--color-papaya)";
};

const langLocaleMap: Record<Lang, string> = {
  [Lang.EN]: "en-US",
  [Lang.DE]: "de-DE",
};

export const formatAccompanyingDate = (date: Date, lang: Lang): string => {
  const locale = langLocaleMap[lang];

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const dateFormatter = new Intl.DateTimeFormat(locale, dateOptions);
  const timeFormatter = new Intl.DateTimeFormat(locale, timeOptions);

  const formattedDatePart: string = dateFormatter.format(date);
  const formattedTimePart: string = timeFormatter.format(date);

  return `${formattedDatePart}, ${formattedTimePart}`;
};
