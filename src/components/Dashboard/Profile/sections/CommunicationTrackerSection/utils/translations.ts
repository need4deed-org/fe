import { TFunction } from "i18next";
import { ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";

export function getContactTypeLabel(t: TFunction, contactType: ContactType): string {
  const key = `dashboard.communicationSection.contactTypes.${contactType.toLowerCase()}`;
  const defaults: Record<ContactType, string> = {
    [ContactType.CALL]: "Called",
    [ContactType.TRIED_CALL]: "Tried to call",
    [ContactType.TEXT_EMAIL]: "Texted or emailed",
    [ContactType.OTHER]: "Other",
  };
  return t(key, defaults[contactType]);
}

export function getContactMethodLabel(t: TFunction, contactMethod: ContactMethodType): string {
  const key = `dashboard.communicationSection.platformOptions.${contactMethod.toLowerCase()}`;
  const defaults: Record<ContactMethodType, string> = {
    [ContactMethodType.PHONE]: "Phone number",
    [ContactMethodType.TELEGRAM]: "Telegram",
    [ContactMethodType.WHATSAPP]: "Whatsapp",
    [ContactMethodType.SIGNAL]: "Signal",
    [ContactMethodType.EMAIL]: "E-mail",
    [ContactMethodType.SMS]: "SMS",
    [ContactMethodType.VOICENOTE]: "Voicenote",
  };
  return t(key, defaults[contactMethod]);
}

export function getCommunicationTypeLabel(t: TFunction, communicationType: CommunicationType): string {
  const key = `dashboard.communicationSection.communicationTypes.${communicationType.toLowerCase()}`;
  const defaults: Record<CommunicationType, string> = {
    [CommunicationType.BRIEF]: "Briefed (accompanying volunteer)",
    [CommunicationType.FIRST_INQUIRY]: "First inquiry sent",
    [CommunicationType.OPPORTUNITY_LIST]: "Opportunity list sent",
    [CommunicationType.STATUS_UPDATE]: "Status update",
    [CommunicationType.POST_FOLLOWUP]: "Post-match follow-up",
  };
  return t(key, defaults[communicationType]);
}

export function getDisplayLabel(
  t: TFunction,
  contactType: ContactType,
  communicationType?: CommunicationType,
): string {
  if (contactType === ContactType.OTHER && communicationType) {
    return getCommunicationTypeLabel(t, communicationType);
  }
  return getContactTypeLabel(t, contactType);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
