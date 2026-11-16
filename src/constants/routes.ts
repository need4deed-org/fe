type Id = string | number;

export const routes = {
  home: (lang: string) => `/${lang}`,
  about: (lang: string) => `/${lang}/about`,
  volunteer: (lang: string) => `/${lang}/opportunity-cards`,
  volunteerForm: (lang: string) => `/${lang}/forms/volunteer`,
  events: (lang: string) => `/${lang}/event-page`,
  event: (lang: string, id: Id) => `/${lang}/event-page/${id}`,
  announcement: (lang: string) => `/${lang}/announcement`,
  forOrganizations: (lang: string) => `/${lang}/for-organizations`,
  faq: (lang: string) => `/${lang}/faq`,
  legal: (lang: string) => `/${lang}/legal`,
  privacy: (lang: string) => `/${lang}/privacy`,
  agreement: (lang: string) => `/${lang}/agreement`,
  racGuidelines: (lang: string) => `/${lang}/rac-guidelines`,

  login: (lang: string) => `/${lang}/login`,
  forgotPassword: (lang: string) => `/${lang}/forgot-password`,
  resetPassword: (lang: string) => `/${lang}/reset-password`,
  registerOrganization: (lang: string) => `/${lang}/register/organization`,
  registerOrganizationComplete: (lang: string) => `/${lang}/register/organization/complete`,
  registerVolunteer: (lang: string) => `/${lang}/register/volunteer`,
  registerVolunteerComplete: (lang: string) => `/${lang}/register/volunteer/complete`,

  dashboard: (lang: string) => `/${lang}/dashboard`,
  volunteers: (lang: string) => `/${lang}/volunteers`,
  volunteerDetail: (lang: string, id: Id) => `/${lang}/volunteers/${id}`,
  opportunities: (lang: string) => `/${lang}/opportunities`,
  opportunityDetail: (lang: string, id: Id) => `/${lang}/opportunities/${id}`,
  newOpportunity: (lang: string) => `/${lang}/opportunities/new`,
  organizations: (lang: string) => `/${lang}/organizations`,
  organizationDetail: (lang: string, id: Id) => `/${lang}/organizations/${id}`,
  posts: (lang: string) => `/${lang}/posts`,
  calendar: (lang: string) => `/${lang}/calendar`,
  calendarCreate: (lang: string) => `/${lang}/calendar/create`,
  calendarEdit: (lang: string, id: Id) => `/${lang}/calendar/${id}/edit`,
  admin: (lang: string) => `/${lang}/admin`,
  profile: (lang: string) => `/${lang}/profile`,
  domains: (lang: string) => `/${lang}/organizations/domains`,
  statistics: (lang: string) => `/${lang}/admin/statistics`,
} as const;

export type RouteBuilder = (lang: string) => string;
