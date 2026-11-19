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

/** `max` is the rule; `allowed` lets text already over it stay or shrink, never grow (fe#1291). */
export type TextLimit = { max: number; allowed: number };

export function textLimit(max: number, current?: string | null): TextLimit {
  return { max, allowed: Math.max(max, textLength(current)) };
}

export type TextLimitIssue = "tooLong" | "shortenOnly";

export function getTextLimitIssue(value: string | null | undefined, limit: TextLimit): TextLimitIssue | null {
  if (textLength(value) <= limit.allowed) return null;
  return limit.allowed > limit.max ? "shortenOnly" : "tooLong";
}

export type OpportunityTextLimits = { title: TextLimit; description: TextLimit };

export const SOURCE_TEXT_LIMITS: OpportunityTextLimits = {
  title: textLimit(OPPORTUNITY_TITLE_MAX_LENGTH),
  description: textLimit(OPPORTUNITY_DESCRIPTION_MAX_LENGTH),
};

const TRANSLATED_DESCRIPTION_TYPES: readonly VolunteerStateTypeType[] = [
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.EVENTS,
];

/**
 * Mirrors be: an edit in a language other than the original is stored as a translation
 * (title always, description only for regular and events opportunities) and gets the
 * translation cap. Over-limit source text may stay or shrink. A translated field gets no
 * such allowance: the form may show the source as a fallback, which be doesn't count,
 * and no stored translation is over its cap.
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
    title: isTranslation
      ? textLimit(OPPORTUNITY_TRANSLATION_MAX_LENGTH.title)
      : textLimit(OPPORTUNITY_TITLE_MAX_LENGTH, opportunity.title),
    description: isTranslatedDescription
      ? textLimit(OPPORTUNITY_TRANSLATION_MAX_LENGTH.info)
      : textLimit(OPPORTUNITY_DESCRIPTION_MAX_LENGTH, opportunity.description),
  };
}
