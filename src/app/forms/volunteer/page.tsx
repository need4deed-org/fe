"use client";

import { PageLayout } from "@/components/Layout";
import BecomeVolunteer from "@/components/forms/BecomeVolunteer/BecomeVolunteer";

export default function VolunteerPage() {
  return (
    <PageLayout background="var(--color-white)">
      <BecomeVolunteer />;
    </PageLayout>
  );
}
