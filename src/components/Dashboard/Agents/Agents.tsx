import { ApiAgentGet } from "need4deed-sdk";
import { AgentCard } from "./AgentCard";

export const Agents = () => {
  const mockAgents = [
    {
      id: 1,
      title: "Hanger 1-3",
      createdAt: "2026-03-06T14:38:26.104Z",
      statusEngagement: "new",
      volunteerSearch: "searching",
      serviceType: "",
      trustLevel: "unknown",
      activeVolunteers: 0,
      district: {
        id: 1,
        title: {
          en: "Mitte",
          de: "Mitte",
        },
      },
      comments: [],
      agentDetails: {},
      type: "",
    },
    {
      id: 2,
      title: "Hanger 1-3",
      createdAt: "2026-03-06T14:38:26.104Z",
      statusEngagement: "active",
      volunteerSearch: "not-needed",
      serviceType: "",
      trustLevel: "unknown",
      activeVolunteers: 0,
      district: {
        id: 1,
        title: {
          en: "Mitte",
          de: "Mitte",
        },
      },
      comments: [],
      agentDetails: {},
      type: "",
    },
    {
      id: 3,
      title: "Hanger 1-3",
      createdAt: "2026-03-06T14:38:26.104Z",
      statusEngagement: "unresponsive",
      volunteerSearch: "volunteers-found",
      serviceType: "",
      trustLevel: "unknown",
      activeVolunteers: 0,
      district: {
        id: 1,
        title: {
          en: "Mitte",
          de: "Mitte",
        },
      },
      comments: [],
      agentDetails: {},
      type: "",
    },
    {
      id: 4,
      title: "Hanger 1-3",
      createdAt: "2026-03-06T14:38:26.104Z",
      statusEngagement: "inactive",
      volunteerSearch: "volunteers-found",
      serviceType: "",
      trustLevel: "unknown",
      activeVolunteers: 0,
      district: {
        id: 1,
        title: {
          en: "Mitte",
          de: "Mitte",
        },
      },
      comments: [],
      agentDetails: {},
      type: "",
    },
  ] as unknown as ApiAgentGet[];
  return mockAgents?.map((agent) => (
    <div key={agent.id}>
      <AgentCard agent={agent} />
    </div>
  ));
};
