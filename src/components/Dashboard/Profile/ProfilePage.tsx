import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import { BackLink, PageContainer } from "./styles";
import { ProfileEntityProps } from "./types";

const ProfilePage = (props: ProfileEntityProps) => {
  const { t, i18n } = useTranslation();
  const { sections, heading, header } = useProfileSections(props);

  const backHref =
    "volunteer" in props
      ? `/${i18n.language}/dashboard/volunteers`
      : "opportunity" in props
        ? `/${i18n.language}/dashboard/opportunities`
        : `/${i18n.language}/dashboard/agents`;

  return (
    <PageContainer>
      <BackLink href={backHref}>
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
