"use client";

import { useState } from "react";
import styled from "styled-components";
import { ShootingStar, CaretDown } from "@phosphor-icons/react";
import type { Opportunity, OpportunityTab } from "../types/types";

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3b87;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  color: ${({ $active }) => ($active ? "#2d3b87" : "#6b7280")};
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2d3b87" : "transparent")};

  &:hover {
    color: #111827;
  }
`;

const PendingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const OpportunitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmptyState = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  padding: 1rem 0;
`;

const OpportunityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;

const OpportunityLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const OpportunityIcon = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  background: rgba(232, 93, 117, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const OpportunityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OpportunityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OpportunityName = styled.h4`
  font-weight: 500;
  color: #2d3b87;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  text-transform: capitalize;
`;

const OpportunityDate = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  color: #2d3b87;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 0.375rem;

  &:hover {
    background: #f3f4f6;
  }

  svg {
    transform: rotate(-90deg);
  }
`;

interface OpportunitiesProps {
  opportunities: Opportunity[];
}

const TABS: { value: OpportunityTab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "matched", label: "Matched" },
  { value: "active", label: "Active" },
  { value: "suggestions", label: "Suggestions" },
  { value: "past", label: "Past" },
];

export function Opportunities({ opportunities }: OpportunitiesProps) {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("matched");

  const filteredOpportunities = opportunities.filter((opp) => opp.status === activeTab);
  const pendingCount = opportunities.filter((opp) => opp.status === "pending").length;

  return (
    <Card>
      <Header>
        <ShootingStar size={20} style={{ color: "#E85D75" }} />
        <Title>Opportunities</Title>
      </Header>

      <TabsContainer>
        {TABS.map((tab) => (
          <Tab key={tab.value} $active={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>
            {tab.label}
            {tab.value === "pending" && pendingCount > 0 && <PendingBadge>{pendingCount}</PendingBadge>}
          </Tab>
        ))}
      </TabsContainer>

      <OpportunitiesList>
        {filteredOpportunities.length === 0 ? (
          <EmptyState>No {activeTab} opportunities</EmptyState>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <OpportunityItem key={opportunity.id}>
              <OpportunityLeft>
                <OpportunityIcon>
                  <ShootingStar size={20} style={{ color: "#E85D75" }} />
                </OpportunityIcon>
                <OpportunityInfo>
                  <OpportunityHeader>
                    <OpportunityName>{opportunity.name}</OpportunityName>
                    <StatusBadge>{opportunity.status}</StatusBadge>
                  </OpportunityHeader>
                  <OpportunityDate>Matched on {opportunity.matchedDate}</OpportunityDate>
                </OpportunityInfo>
              </OpportunityLeft>
              <ViewButton>
                Go to profile
                <CaretDown size={16} />
              </ViewButton>
            </OpportunityItem>
          ))
        )}
      </OpportunitiesList>
    </Card>
  );
}
