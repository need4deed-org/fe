export enum VolunteerEngagementStatus {
  NOT_SET = "Not Set",
  NEW = "New",
  ACTIVE = "Active",
  TEMP_INACTIVE = "Temp inactive",
  INACTIVE = "inactive",
}

export enum VolunteerProfile {
  ENGAGEMENT_STATUS = "Engagement Status",
  VOLUNTEER_TYPE = "Volunteer type",
  MATCH_STATUS = "Match status",
  COMMUNICATION = "communication",
  APPRECIATION = "appreciation",
  CERTIFICATE_OF_GC = "certificate of GC",
}

export enum VolunteerType {
  NOT_SET = "Not Set",
  ACCOMPANING = "Accompanying",
  OTHER = "Other",
}

export enum MatchStatus {
  NOT_SET = "Not Set",
  MATCHED = "Matched",
  REMATCHED = "Needs to be Rematch",
  UNMATCHED = "Unmatched",
}

export enum Communication {
  NOT_SET = "Not Set",
  CALLED = "Called",
  EMAIL = "Email sent",
  BRIEFED = "Briefed",
  TRIED_CALL = "Tried to call",
  NOT_RESPONDING = "Not responding",
}

export enum Appreciation {
  NOT_SET = "Not Set",
  T_SHIRT = "T-Shirt",
  BENEFIT_CARD = "Benefit Card",
  TOTE_BAG = "Tote Bag",
}

export enum CertificateOfGC {
  NOT_SET = "Not Set",
  UPLOADED = "Uploaded",
  MISSING = "Missing",
}
export enum DropdownType {
  ENGAGEMENT_STATUS = "engagementStatus",
  VOLUNTEER_TYPE = "volunteerType",
  MATCH_STATUS = "matchStatus",
  COMMUNICATION = "communication",
}
