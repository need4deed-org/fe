import { ApiVolunteerGet, ByDay, DocumentStatusType, Hour, LangProficiency, VolunteerStateAppreciationType, VolunteerStateCGCType, VolunteerStateCommunicationType, VolunteerStateEngagementType, VolunteerStateMatchType, VolunteerStateType, VolunteerStateTypeType } from "need4deed-sdk";
import ProfilePage from "./ProfilePage";

type ProfileControllerProps = {
  volunteerId?: string;
};

export function ProfileController({ volunteerId }: ProfileControllerProps) {
  
  if (!volunteerId) {
    return <div>Volunteer ID is missing.</div>;
  }
  //Mock Data
  const volunteerData: ApiVolunteerGet = {
    id: 1,
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
      avatarUrl: "https://example.com/avatar.jpg",
    },

    status: "new" as VolunteerStateType, // Use proper enum value
    statusEngagement: VolunteerStateEngagementType.ACTIVE,
    statusCommunication: VolunteerStateCommunicationType.CALLED,
    statusAppreciation: VolunteerStateAppreciationType.T_SHIRT,
    statusType: VolunteerStateTypeType.REGULAR,
    statusMatch: VolunteerStateMatchType.MATCHED,
    statusCgcProcess: VolunteerStateCGCType.UPLOADED,

    languages: [
      {
        id: 1,
        title: "English",
        proficiency: LangProficiency.FLUENT,
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
        day: ByDay.MO,
        daytime: [Hour.H09, Hour.H17],
        timeslotId: 0,
        description: "",
        start: new Date("2025-11-01T09:00:00Z"),
      }
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

    goodConductCertificate: DocumentStatusType.UNDEFINED,
    measlesVaccination: DocumentStatusType.YES,

    infoAbout: "Interested in volunteering for community outreach.",
    infoExperience: "2 years experience in student events and tech support.",

    timelineLogs: [
      {
        id: 1,
        timestamp: new Date("2025-11-15T18:03:05.996Z"),
        content: "Volunteer profile created by admin.",
      }
    ],

    comments: [
      {
        id: 1,
        timestamp: new Date("2025-11-16T11:45:10.120Z"),
        content: "Very motivated candidate. Good communication skills.",
      },
    ],

    opportunitiesApplied: [
      {
        id: 1,
        title: "Community Outreach Assistant"
      },

    ],

    opportunitiesMatched: [
      {
        id: 2,
        title: "Tech Support Volunteer",
      },
    ],
  };

  return <ProfilePage volunteers={volunteerData} />;
}