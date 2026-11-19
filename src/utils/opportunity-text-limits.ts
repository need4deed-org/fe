import {
  Lang,
  OPPORTUNITY_DESCRIPTION_MAX_LENGTH,
  OPPORTUNITY_TITLE_MAX_LENGTH,
  OPPORTUNITY_TRANSLATION_MAX_LENGTH,
  VolunteerStateTypeType,
} from "need4deed-sdk";

/** Counts characters the way be does: code points, surrounding whitespace ignored. */
export function textLength(value: string | null | undefined): number {
  return Array.from((value ?? "").trim()).length;
}

/** Text already over the limit may stay or shrink, never grow (fe#1291). */
export function allowedTextLength(limit: number, current?: string | null): number {
  return Math.max(limit, textLength(current));
}

export type OpportunityTextLimits = { title: number; description: number };

export const SOURCE_TEXT_LIMITS: OpportunityTextLimits = {
  title: OPPORTUNITY_TITLE_MAX_LENGTH,
  description: OPPORTUNITY_DESCRIPTION_MAX_LENGTH,
};

const TRANSLATED_DESCRIPTION_TYPES: readonly VolunteerStateTypeType[] = [
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.EVENTS,
];

/**
 * Mirrors be: an edit in a language other than the original is stored as a translation
 * (title always, description only for regular and events opportunities), so it gets the
 * translation cap. Text already over its cap may stay or shrink, never grow.
 */
export function getOpportunityTextLimits(
  opportunity: {
    title: string;
    description?: string | null;
    volunteerType: VolunteerStateTypeType;
    originalLanguage?: Lang;
  },
  language: Lang,
): OpportunityTextLimits {
  const isTranslation = language !== (opportunity.originalLanguage ?? Lang.DE);
  const isTranslatedDescription = isTranslation && TRANSLATED_DESCRIPTION_TYPES.includes(opportunity.volunteerType);
  return {
    title: allowedTextLength(
      isTranslation ? OPPORTUNITY_TRANSLATION_MAX_LENGTH.title : OPPORTUNITY_TITLE_MAX_LENGTH,
      opportunity.title,
    ),
    description: allowedTextLength(
      isTranslatedDescription ? OPPORTUNITY_TRANSLATION_MAX_LENGTH.info : OPPORTUNITY_DESCRIPTION_MAX_LENGTH,
      opportunity.description,
    ),
  };
}
