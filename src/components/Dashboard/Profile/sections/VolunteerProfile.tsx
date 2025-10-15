"use client";

import styled from "styled-components";
import { User } from "@phosphor-icons/react";
import type { VolunteerProfile as VolunteerProfileType } from "../types/types";
import Divider from "../common/Divider";
import { ApiVolunteerGet } from "need4deed-sdk";

const Main = styled.div`
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3b87;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: #7b2d8e;
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6b2578;
  }
`;

const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ProfileLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3b87;
  min-width: 140px;
`;

const ProfileValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
`;

const BadgeSection = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Badge = styled.span<{ $variant: "purple" | "blue" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;

  ${({ $variant }) => {
    switch ($variant) {
      case "purple":
        return `
          background: #faf5ff;
          color: #7c3aed;
          border-color: #e9d5ff;
        `;
      case "blue":
        return `
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        `;
    }
  }}
`;

interface Props {
  volunteer: ApiVolunteerGet;
}

export function VolunteerProfileSection({ volunteer }: Props) {
  console.log("volunteer", volunteer);

  const formatted = volunteer.languages.map((lang) => `${lang.title} - ${lang.proficiency}`).join(", ");
  return (
    <Main>
      <Header>
        <HeaderLeft>
          <User size={40} style={{ color: "#E85D75" }} />
          <Title>Volunteer profile</Title>
        </HeaderLeft>
        {/* {onEdit && <EditButton onClick={onEdit}>Edit</EditButton>} */}
      </Header>

      <ProfileList>
        <ProfileRow>
          <ProfileLabel>Languages</ProfileLabel>
          <ProfileValue>{formatted}</ProfileValue>
        </ProfileRow>
        <Divider />
        <ProfileRow>
          <ProfileLabel>Availability</ProfileLabel>
          {/* <ProfileValue>{volunteer.availability}</ProfileValue> */}
        </ProfileRow>
        <Divider />
        <ProfileRow>
          <ProfileLabel>Districts</ProfileLabel>
          {/* <ProfileValue>{volunteer.districts.join(", ")}</ProfileValue> */}
        </ProfileRow>
        <Divider />
        <BadgeSection>
          <ProfileLabel>Activities</ProfileLabel>
          {/* <BadgeContainer>
            {profile.activities.map((activity) => (
              <Badge key={activity} $variant="purple">
                {activity}
              </Badge>
            ))}
          </BadgeContainer> */}
        </BadgeSection>

        <BadgeSection>
          <ProfileLabel>Skills & experience</ProfileLabel>
          {/* <BadgeContainer>
            {profile.skills.map((skill) => (
              <Badge key={skill} $variant="blue">
                {skill}
              </Badge>
            ))}
          </BadgeContainer> */}
        </BadgeSection>
      </ProfileList>
    </Main>
  );
}
