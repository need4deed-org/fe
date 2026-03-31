import { ApiAgentGet } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useState } from "react";

const columns = 3;
const rows = 3;

export const AgentListController = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // TODO connect to API, which is later subtask
  //   Merging ApiAgentGetList & ApiAgentGet types for now as need
  const mockAgents = [
    {
      id: 1,
      title: "Hanger 1-3",
      createdAt: "2026-03-06T14:38:26.104Z",
      statusEngagement: "new",
      volunteerSearch: "searching",
      serviceType: ["refugee-accommodation"],
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
      serviceType: ["childcare"],
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
      serviceType: ["welfare"],
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
      serviceType: ["consultation"],
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
  return (
    <AgentCardList
      agents={mockAgents}
      count={0}
      columns={columns}
      rows={rows}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
