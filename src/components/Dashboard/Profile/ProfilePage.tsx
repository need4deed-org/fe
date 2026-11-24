import { Select } from "@/components/core/common/select";
import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import {
  BackButton,
  PageContainer,
  PageContentContainer,
  ProfileNavigatorContainer,
  ProfileNavigatorWrapper,
} from "./styles";
import { ProfileEntityProps, ProfileNavigationDirection } from "./types";
import { useFadedNavigation } from "./useFadedNavigation";
import { DashboardRoutes } from "@/config/constants";

const FADE_DURATION = 300;

const ProfilePage = (props: ProfileEntityProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { sections, heading, header } = useProfileSections(props);

  const { navigateWithFade, isFading } = useFadedNavigation(props.agent ? props.agent.id : 0);

  const navigation = props.profileNavigation;

  return (
    <PageContainer>
      <BackButton onClick={() => router.push(`/${i18n.language}${DashboardRoutes.Home}`)}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>

      <Heading2>{heading}</Heading2>

      {navigation && (
        <ProfileNavigatorWrapper>
          <ProfileNavigatorContainer
            onClick={() => navigateWithFade(() => navigation.onStep(ProfileNavigationDirection.LEFT))}
          >
            <ArrowLeftIcon size={24} />
            {t("dashboard.profile.prevNgoProfile")}
          </ProfileNavigatorContainer>
          {navigation.options.length > 0 && (
            <Select
              aria-label={t("dashboard.profile.selectNgoProfile")}
              value={navigation.selectedId}
              onChange={(event) => {
                const id = Number(event.target.value);
                navigateWithFade(() => navigation.onSelect(id));
              }}
            >
              {navigation.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </Select>
          )}
          <ProfileNavigatorContainer
            onClick={() => navigateWithFade(() => navigation.onStep(ProfileNavigationDirection.RIGHT))}
          >
            {t("dashboard.profile.nextNgoProfile")}
            <ArrowRightIcon size={24} />
          </ProfileNavigatorContainer>
        </ProfileNavigatorWrapper>
      )}

      <PageContentContainer $isFading={isFading} $fadeDuration={FADE_DURATION}>
        {header}

        {sections.map((s) => (
          <SectionCard key={s.title} {...s} />
        ))}
      </PageContentContainer>
    </PageContainer>
  );
};

export default ProfilePage;
