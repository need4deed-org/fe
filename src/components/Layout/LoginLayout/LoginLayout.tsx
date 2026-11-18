"use client";
import { routes } from "@/constants/routes";
import Image from "next/image";
import { getImageUrl } from "@/utils";
import { ArrowRight } from "@phosphor-icons/react";
import { ReactNode, useId } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Illustration,
  LoginHeading,
  LoginPage,
  LoginSection,
  RegistrationHeading,
  RegistrationLink,
  RegistrationLinks,
  RegistrationSection,
} from "./login-layout-styles";

type Props = {
  children: ReactNode;
  heading: string;
  showRegistration?: boolean;
};

export function LoginLayout({ children, heading, showRegistration = false }: Props) {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const headingId = useId();
  const registrationHeadingId = useId();

  return (
    <LoginPage>
      <LoginSection aria-labelledby={headingId}>
        <LoginHeading id={headingId} $compact={!showRegistration}>
          {heading}
        </LoginHeading>
        {children}
      </LoginSection>
      <RegistrationSection
        $illustrationOnly={!showRegistration}
        as={showRegistration ? "section" : "div"}
        aria-labelledby={showRegistration ? registrationHeadingId : undefined}
      >
        <Illustration>
          <Image src={getImageUrl("animals-on-transparent.webp")} alt="" width={671} height={669} />
        </Illustration>
        {showRegistration && (
          <>
            <RegistrationHeading id={registrationHeadingId}>{t("dashboard.login.newToNeed4Deed")}</RegistrationHeading>
            <RegistrationLinks>
              <RegistrationLink href={routes.registerOrganization(lang)}>
                {t("dashboard.login.createNgoAccount")}
                <ArrowRight size={28} aria-hidden="true" />
              </RegistrationLink>
              <RegistrationLink href={routes.registerVolunteer(lang)}>
                {t("dashboard.login.createVolunteerAccount")}
                <ArrowRight size={28} aria-hidden="true" />
              </RegistrationLink>
            </RegistrationLinks>
          </>
        )}
      </RegistrationSection>
    </LoginPage>
  );
}
