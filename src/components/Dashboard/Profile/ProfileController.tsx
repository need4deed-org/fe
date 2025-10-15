import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import Profile from "./ProfilePage";

export function VolunteerController() {
  const { data: volunteerData, isLoading } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteersProfile"],
    apiPath: "http://localhost:5001/volunteer/1086",
  });

  // const volunteerData = {
  //   id: 1086,
  //   status: "New",
  //   languages: [
  //     {
  //       title: "German",
  //       proficiency: "native",
  //     },
  //     {
  //       title: "English",
  //       proficiency: "fluent",
  //     },
  //     {
  //       title: "Arabic",
  //       proficiency: "intermediate",
  //     },
  //   ],
  //   availability: [
  //     [1, "08-11"],
  //     [2, "11-14"],
  //     [4, "14-17"],
  //     [0, "weekdays"],
  //   ],

  //   activities: ["Daycare", "Sports", "Language café"],
  //   skills: [],
  //   locations: ["Mitte", "Moabit", "Wedding"],
  //   createdAt: "2025-10-10T14:52:56.944Z",
  //   updatedAt: "2025-10-10T14:52:56.944Z",
  //   goodConductCertificate: "undefined",
  //   measlesVaccination: "undefined",
  //   infoAbout: "",
  //   infoExperience: "",
  //   timelineLogs: [],
  //   comments: [],
  //   opportunitiesApplied: [],
  //   opportunitiesMatched: [],
  //   person: {
  //     id: 1433,
  //     firstName: "mati",
  //     lastName: "lastname",
  //     middleName: "",
  //     email: "mattgammie@gmail.com",
  //     phone: "",
  //     address: {
  //       id: 1311,
  //       street: "street",
  //       city: "Berlin",
  //       postcode: {
  //         id: 392,
  //         code: "12345",
  //         latitude: 0,
  //         longitude: 0,
  //       },
  //     },
  //     avatarUrl: "all_genders_avatar.png",
  //   },
  //   statusEngagement: "New",
  //   statusCommunication: "",
  //   statusAppreciation: "",
  //   statusType: ["Accompanying", "Weekend-only"],
  //   statusMatch: "Matched",
  //   statusCgcProcess: "",
  // };

  if (isLoading || !volunteerData) {
    return <div>Loading...</div>;
  }

  return <Profile volunteers={volunteerData} />;
}
