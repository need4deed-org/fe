import React from "react";
import styled from "styled-components";
import { IconName, ProfileCardTypes } from "./types/types";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { VolunteerHeader } from "./sections/VolunteerHeader";
import { CommentsList } from "@/components/core/comment";
import { Comment } from "@/types";
import { Heading2 } from "@/components/styled/text";
import { Card } from "./common/SectionCard";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--volunteer-profile-container-width);
  gap: var(--volunteer-profile-container-gap);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--volunteer-profile-back-link-gap);
  font-size: var(--volunteer-profile-back-link-font-size);
  color: var(--color-midnight);
  text-decoration: none;
  transition: var(--volunteer-profile-back-link-transition);
`;

interface ProfilePageProps {
  type?: ProfileCardTypes;
  volunteer: ApiVolunteerGet;
}

const ProfilePage = ({ volunteer }: ProfilePageProps) => {
  const { t, i18n } = useTranslation();

  // Mock comments data - replace with real API call
  const mockComments: Comment[] = [
    {
      id: "1",
      userId: "user1",
      userName: "Kalima",
      text: "Leni works as a social worker with special-needs children, supporting learning development",
      timestamp: new Date("2024-08-04T13:14:00").toISOString(),
    },
    {
      id: "2",
      userId: "user2",
      userName: "Kalima",
      text: "Comment example here. An emergency with the appointment.",
      timestamp: new Date("2024-09-01T12:12:00").toISOString(),
    },
  ];

  // Mock functions - replace with real API calls
  const handlePatch = async (commentId: string, updatedText: string) => {
    console.log("PATCH:", commentId, updatedText);
    // TODO: Implement real API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleDelete = async (commentId: string) => {
    console.log("DELETE:", commentId);
    // TODO: Implement real API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleAdd = async (text: string) => {
    console.log("ADD:", text);
    // TODO: Implement real API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <PageContainer>
      <BackLink href={`/${i18n.language}/dashboard`}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading2>{t("dashboard.volunteerProfile.volunteersProfile")}</Heading2>

      <Card>
        <VolunteerHeader volunteer={volunteer} />
      </Card>

      <Card>
        <CommentsList
          comments={mockComments}
          onPatch={handlePatch}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </Card>
    </PageContainer>
  );
};

export default ProfilePage;
