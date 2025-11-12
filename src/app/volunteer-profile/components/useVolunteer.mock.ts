import { ApiVolunteerGet } from "need4deed-sdk";
import { VolunteerStateType,
  VolunteerStateEngagementType,
  VolunteerStateCommunicationType,
  VolunteerStateAppreciationType,
  VolunteerStateTypeType,
  VolunteerStateMatchType,
  VolunteerStateCGCType,
  DocumentStatusType,
  LangProficiency,
  LangPurpose,
  ByDay,
  Occasionally,
  Hour,
  OccasionalType,
 } from "need4deed-sdk";

export const useVolunteerMock = (id: number): ApiVolunteerGet => {
  return {
    id,
    person: {
      id: 1,
      avatarUrl: "avatarUrl",
      firstName: "Emily",
      middleName: "Ann",
      lastName: "Thompson",
      email: "emily.thompson@example.com",
      phone: "+44 7700 900123",
      address: {
        id: 123,
        street: "Main St",
        city: "Berlin",
        postcode: {
          id: 12,
          code: "SW1A 1AA",
          latitude: 51.5,
          longitude: -0.1,
        }
      }
    },
    status: VolunteerStateType.ACTIVE_REGULAR,
    statusEngagement: VolunteerStateEngagementType.NEW,
    statusCommunication: VolunteerStateCommunicationType.CALLED,
    statusAppreciation: VolunteerStateAppreciationType.TOTE_BAG,
    statusType: VolunteerStateTypeType.ACCOMPANYING,
    statusMatch: VolunteerStateMatchType.MATCHED,
    statusCgcProcess: VolunteerStateCGCType.UPLOADED,
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date(),
    goodConductCertificate: DocumentStatusType.APPLIED_SELF,
    measlesVaccination: DocumentStatusType.YES,
    infoAbout:
      "Emily is passionate about community service and enjoys working with elderly people. She is friendly, patient, and always willing to help.",
    infoExperience:
      "She has over three years of experience volunteering in care homes and supporting physical rehabilitation programs.",
    timelineLogs: [
      {
        id: 1,
        timestamp: new Date(),
        content: "Emily joined the volunteer program.",
      },
      {
        id: 2,
        timestamp: new Date(),
        content: "Emily is happy about the volunteer program.",
      },
    ],
    comments: [
      {
        id: 1,
        timestamp: new Date(),
        content: "Emily joined the volunteer program.",
      },
      {
        id: 2,
        timestamp: new Date(),
        content: "Emily is happy about the volunteer program.",
      },
    ],
    opportunitiesApplied: [
      {
        title: "Rehabilitation assistance program",
        id: 1,
      },
    ],
    opportunitiesMatched: [
      {
        title: "Rehabilitation assistance program",
        id: 1,
      },
    ],
    languages: 
      [ 
        {
          id: 1,
          title: "English",
          proficiency: LangProficiency.ADVANCED,
          purpose: LangPurpose.TRANSLATION,
        },
      ],
    availability: [
      {
        id: "1",
        description: "Helping elderly people with daily tasks",
        start: new Date(),
        timeslotId: 10,
        day: Occasionally.OCCASIONALLY,
        daytime: [OccasionalType.WEEKENDS]
      }
    ],
    activities: [
      {
        id: 1,
        title: "Helping elderly people with daily tasks",
      }
    ],
    skills: [
      { id: 1, title: "Empathy" },
      { id: 2, title: "Communication" },
      { id: 3, title: "Teamwork" },
    ],
    locations: [{ id: 1, title: "Berlin" }],
  };
};
