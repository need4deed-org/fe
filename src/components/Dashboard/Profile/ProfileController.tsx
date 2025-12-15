import {
  ByDay,
  Daytime,
  DocumentStatusType,
  Hour,
  LangProficiency,
  VolunteerStateAppreciationType,
  VolunteerStateCGCType,
  VolunteerStateCommunicationType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import ProfilePage from "./ProfilePage";

export function ProfileController({ volunteerId }: { volunteerId?: string }) {
  //Mock Data
  const volunteerData = {
    id: volunteerId ? parseInt(volunteerId) : 100,
    person: {
      id: 101,
      firstName: "Jagdish",
      lastName: "Mehra",
      middleName: "Kumar",
      email: "jagdish.mehra@example.com",
      phone: "+447912345678",
      address: {
        id: 1,
        street: "123 High Street",
        city: "Birmingham",
        postcode: {
          id: 1,
          code: "B1 1AA",
          latitude: 52.4797,
          longitude: -1.9027,
        },
      },
      avatarUrl: "",
    },

    status: VolunteerStateType.NEW,
    statusEngagement: VolunteerStateEngagementType.NEW,
    statusCommunication: VolunteerStateCommunicationType.CALLED,
    statusAppreciation: VolunteerStateAppreciationType.T_SHIRT,
    statusType: VolunteerStateTypeType.ACCOMPANYING,
    statusMatch: VolunteerStateMatchType.MATCHED,
    statusCgcProcess: VolunteerStateCGCType.MISSING,

    languages: [
      {
        id: 1,
        title: "English",
        proficiency: LangProficiency.BEGINNER,
      },
      {
        id: 2,
        title: "Hindi",
        proficiency: LangProficiency.NATIVE,
      },
    ],

    availability: [
      {
        id: "10",
        timeslotId: 100,
        description: "",
        start: new Date("2025-12-01T09:00:00Z"),
        end: new Date("2025-12-01T11:00:00Z"),
        day: ByDay.MO,
        daytime: [Hour.H09, Hour.H11] as Daytime,
      },
      {
        id: "11",
        timeslotId: 100,
        description: "",
        start: new Date("2025-12-01T11:00:00Z"),
        end: new Date("2025-12-01T14:00:00Z"),
        day: ByDay.WE,
        daytime: [Hour.H11, Hour.H14] as Daytime,
      },
    ],

    activities: [
      {
        title: "Community Support",
        id: 5,
      },
    ],

    skills: [
      {
        title: "ReactJS Development",
        id: 8,
      },
      {
        title: "Communication",
        id: 9,
      },
    ],

    locations: [
      {
        title: "Birmingham Central",
        id: 3,
      },
    ],

    createdAt: new Date("2025-11-15T18:03:05.996Z"),
    updatedAt: new Date("2025-11-15T18:03:05.996Z"),

    goodConductCertificate: DocumentStatusType.NO,
    measlesVaccination: DocumentStatusType.YES,

    infoAbout: "Interested in volunteering for community outreach.",
    infoExperience: "2 years experience in student events and tech support.",

    timelineLogs: [
      {
        timestamp: new Date("2025-11-15T18:03:05.996Z"),
        id: 1,
        content: "Volunteer profile created by admin.",
      },
      {
        timestamp: new Date("2025-11-16T10:20:30.220Z"),
        id: 2,
        content: "Added language and availability details.",
      },
    ],

    comments: [
      {
        timestamp: new Date("2025-11-16T11:45:10.120Z"),
        id: 3,
        content: "Very motivated candidate. Good communication skills.",
      },
    ],

    opportunitiesApplied: [
      {
        id: 1,
        title: "Gemeinschaftsbetreuungsassistent",
      },
    ],

    opportunitiesMatched: [
      {
        id: 2,
        title: "Technischer Support Freiwilliger",
      },
    ],
  };

  return <ProfilePage volunteer={volunteerData} />;
}
