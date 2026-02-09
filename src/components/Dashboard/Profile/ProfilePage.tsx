import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import { BackLink, PageContainer } from "./styles";
import { ProfileEntityProps } from "./types/types";

const ProfilePage = (props: ProfileEntityProps) => {
  const { t, i18n } = useTranslation();
  const { sections, heading, header } = useProfileSections(props);

  return (
    <PageContainer>
      <BackLink href={`/${i18n.language}/dashboard`}>
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
