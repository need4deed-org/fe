import {
  Lang,
  OPPORTUNITY_DESCRIPTION_MAX_LENGTH,
  OPPORTUNITY_TITLE_MAX_LENGTH,
  OPPORTUNITY_TRANSLATION_MAX_LENGTH,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import type { RefinementCtx } from "zod";

/** Counts characters the way be does: code points, surrounding whitespace ignored. */
export function textLength(value: string | null | undefined): number {
  return Array.from((value ?? "").trim()).length;
}

/**
 * be's rule (fe#1291): `max` is the cap; text already over it (`current`) may stay unchanged
 * or shrink, never grow, so `allowed` is the larger of the two.
 */
export type TextLimit = { max: number; allowed: number; current: string };

export function textLimit(max: number, current?: string | null): TextLimit {
  return { max, allowed: Math.max(max, textLength(current)), current: current ?? "" };
}

export type TextLimitIssue = "tooLong" | "shortenOnly";

export function getTextLimitIssue(value: string | null | undefined, limit: TextLimit): TextLimitIssue | null {
  if ((value ?? "").trim() === limit.current.trim()) return null;
  if (textLength(value) <= limit.allowed) return null;
  return limit.allowed > limit.max ? "shortenOnly" : "tooLong";
}

type Translate = (key: string, options?: Record<string, unknown>) => string;

export type TextLimitMessages = Record<TextLimitIssue, string>;

export function getTextLimitMessage(
  t: Translate,
  value: string | null | undefined,
  limit: TextLimit,
  messages: TextLimitMessages,
): string | null {
  const issue = getTextLimitIssue(value, limit);
  return issue && t(messages[issue], { max: limit.max, allowed: limit.allowed, count: textLength(value) });
}

export function refineTextLimit(t: Translate, limit: TextLimit, messages: TextLimitMessages) {
  return (value: string, ctx: RefinementCtx) => {
    const message = getTextLimitMessage(t, value, limit, messages);
    if (message) ctx.addIssue({ code: "custom", message });
  };
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
 * translation cap. The text shown may stay or shrink. For a translated field that text may
 * be the source fallback, which be doesn't count; no source is over a translation cap, so
 * this never lets through what be rejects.
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
    title: textLimit(
      isTranslation ? OPPORTUNITY_TRANSLATION_MAX_LENGTH.title : OPPORTUNITY_TITLE_MAX_LENGTH,
      opportunity.title,
    ),
    description: textLimit(
      isTranslatedDescription ? OPPORTUNITY_TRANSLATION_MAX_LENGTH.info : OPPORTUNITY_DESCRIPTION_MAX_LENGTH,
      opportunity.description,
    ),
  };
}
