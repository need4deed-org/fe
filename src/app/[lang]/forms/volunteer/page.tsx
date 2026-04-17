"use client";
import BecomeVolunteer from "@/components/forms/BecomeVolunteer/BecomeVolunteer";
import { PageLayout } from "@/components/Layout";

export default function VolunteerPage() {
  return (
    <PageLayout background="var(--color-white)" isPublicPage>
      <BecomeVolunteer />;
    </PageLayout>
  );
}
