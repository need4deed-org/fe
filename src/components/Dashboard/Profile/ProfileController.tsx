import ProfilePage from "./ProfilePage";

export function ProfileController() {
  //Mock Data
  const volunteerData = {
    id: 1,
    person: {
      id: 101,
      firstName: "Jagdish",
      lastName: "Mehra",
      middleName: "Kumar",
      email: "jagdish.mehra@example.com",
      phone: "+447912345678",
      address: {
        id: "addr_001",
        street: "123 High Street",
        city: "Birmingham",
        postcode: {
          id: "pc_001",
          code: "B1 1AA",
          latitude: 52.4797,
          longitude: -1.9027,
        },
      },
      avatarUrl: "",
    },

    status: "New",
    statusEngagement: "New",
    statusCommunication: "called",
    statusAppreciation: "t-shirt",
    statusType: "accompanying",
    statusMatch: "Matched",
    statusCgcProcess: "accompanying",

    languages: [
      {
        id: 1,
        title: "English",
        proficiency: "beginner",
      },
      {
        id: 2,
        title: "Hindi",
        proficiency: "native",
      },
    ],

    availability: [
      {
        id: 10,
        day: "Monday",
        daytime: ["09:00", "17:00"],
      },
      {
        id: 11,
        day: "Wednesday",
        daytime: ["10:00", "14:00"],
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

    createdAt: "2025-11-15T18:03:05.996Z",
    updatedAt: "2025-11-15T18:03:05.996Z",

    goodConductCertificate: "not provided",
    measlesVaccination: "provided",

    infoAbout: "Interested in volunteering for community outreach.",
    infoExperience: "2 years experience in student events and tech support.",

    timelineLogs: [
      {
        date: "2025-11-15T18:03:05.996Z",
        type: "create",
        text: "Volunteer profile created by admin.",
      },
      {
        date: "2025-11-16T10:20:30.220Z",
        type: "update",
        text: "Added language and availability details.",
      },
    ],

    comments: [
      {
        date: "2025-11-16T11:45:10.120Z",
        type: "note",
        text: "Very motivated candidate. Good communication skills.",
      },
    ],

    opportunitiesApplied: [
      {
        id: "opp_001",
        title: {
          en: "Community Outreach Assistant",
          de: "Gemeinschaftsbetreuungsassistent",
        },
      },
    ],

    opportunitiesMatched: [
      {
        id: "opp_002",
        title: {
          en: "Tech Support Volunteer",
          de: "Technischer Support Freiwilliger",
        },
      },
    ],
  };

  return <ProfilePage volunteers={volunteerData} />;
}
