"use client";
import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import { BackLink, PageContainer } from "./styles";
import { ProfileEntityProps } from "./types";

const ProfilePage = (props: ProfileEntityProps) => {
  const { t } = useTranslation();
  const { sections, heading, header } = useProfileSections(props);
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <PageContainer>
      <BackLink href="." onClick={handleBack}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading2>{heading}</Heading2>

      {header}

      {sections.map((s) => (
        <SectionCard key={s.title} {...s} />
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
