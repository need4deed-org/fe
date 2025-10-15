"use client";

import styled from "styled-components";
import { ChartLine } from "@phosphor-icons/react";
import type { Activity } from "../types/types";

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
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

const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DateGroup = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityDot = styled.div`
  flex-shrink: 0;
  margin-top: 0.25rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 50%;
  background: #e85d75;
`;

const ActivityContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ActivityDescription = styled.p`
  font-size: 0.875rem;
  color: #111827;
`;

const ActivityMeta = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <Card>
      <Header>
        <ChartLine size={20} style={{ color: "#E85D75" }} />
        <Title>Activity log</Title>
      </Header>

      <ActivitiesList>
        {activities.map((activity, index) => (
          <div key={activity.id}>
            {(index === 0 ||
              new Date(activity.date).toLocaleDateString() !==
                new Date(activities[index - 1].date).toLocaleDateString()) && (
              <DateGroup>{formatDateGroup(activity.date)}</DateGroup>
            )}
            <ActivityItem>
              <ActivityDot />
              <ActivityContent>
                <ActivityDescription>{activity.description}</ActivityDescription>
                <ActivityMeta>
                  {activity.author} • {formatTime(activity.date)}
                </ActivityMeta>
              </ActivityContent>
            </ActivityItem>
          </div>
        ))}
      </ActivitiesList>
    </Card>
  );
}

function formatDateGroup(date: string): string {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (activityDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (activityDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return activityDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

function formatTime(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
