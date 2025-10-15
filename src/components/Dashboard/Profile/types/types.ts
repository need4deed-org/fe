// Core volunteer data types
export interface Volunteer {
  id: string;
  name: string;
  volunteerSince: string;
  profileImage: string;
  engagementStatus: EngagementStatus;
  volunteerType: VolunteerType;
  matchStatus: MatchStatus;
  communication: CommunicationType;
  appreciation: AppreciationType;
  certificateStatus: CertificateStatus;
}

export type EngagementStatus = "active" | "inactive" | "on-hold";
export type VolunteerType = "accompanying" | "tutoring" | "mentoring";
export type MatchStatus = "matched" | "unmatched" | "pending";
export type CommunicationType = "called" | "emailed" | "messaged";
export type AppreciationType = "t-shirt" | "certificate" | "gift-card";
export type CertificateStatus = "uploaded" | "pending" | "missing";

// Contact information
export interface ContactDetails {
  phone: string;
  email: string;
  address: string;
  waysToContact: string[];
}

// Volunteer profile details
export interface VolunteerProfile {
  languages: Language[];
  availability: string;
  districts: string[];
  activities: string[];
  skillsAndExperience: string[];
}

export interface Language {
  name: string;
  proficiency: "native" | "fluent" | "intermediate" | "basic";
}

// Opportunities
export interface Opportunity {
  id: string;
  name: string;
  status: OpportunityStatus;
  matchedDate: string;
}

export type OpportunityStatus = "pending" | "matched" | "active" | "suggestion" | "past";
export type OpportunityTab = "pending" | "matched" | "active" | "suggestions" | "past";

// Comments
export interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
}

// Documents
export interface Document {
  id: string;
  type: string;
  status: DocumentStatus;
  uploadedOn: string | null;
}

export type DocumentStatus = "uploaded" | "missing";

// Activity log
export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  author: string;
  date: string;
}

export type ActivityType = "status-change" | "document-upload" | "match" | "application";

export enum ProfileCardTypes {
  VOLUNTEER_HEADER = "VOLUNTEER_HEADER",
  CONTACT = "CONTACT",
  VOLUNTEER = "VOLUNTEER",
  // OPPORTUNITIES = "OPPORTUNITIES",
  // COORDINATE = "COORDINATE",
  // DOCUMENTS = "DOCUMENTS",
  // ACTIVITY = "ACTIVITY",
}

export interface ProfileCardProps {
  type: ProfileCardTypes;
  title: string;
}
