"use client";

import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { getImageUrl } from "@/utils/helpers";

import { PageLayout } from "../Layout";
import { ImageWithGradient } from "../core/image";
import { CustomHeading } from "../styled/text";
import { LoginForm } from "./LoginForm";

const gradientClassName = "image-filter-gradient-blue ";

const imageNames: Record<ScreenTypes, string> = {
  mobile: "login-hands.webp",
  tablet: "login-hands.webp",
  desktop: "login-hands.webp",
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: var(--dashboard-login-container-height);
`;

const LoginSubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const LoginContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--dashboard-login-content-container-width);
  gap: var(--dashboard-login-content-container-gap);
`;

export function Login() {
  const screenType = useScreenType();
  const imageUrl = getImageUrl(imageNames[screenType]);
  const { t } = useTranslation();

  return (
    <PageLayout background="var(--color-white)">
      <LoginContainer>
        <LoginSubContainer>
          <LoginContentContainer>
            <CustomHeading
              fontWeight="var(--dashboard-login-heading-fontWeight)"
              fontSize="var(--dashboard-login-heading-fontSize)"
              lineheight="var(--dashboard-login-heading-lineHeight)"
              letterSpacing="var(--dashboard-login-heading-letterSpacing)"
              color="var(--color-midnight)"
            >
              {t("dashboard.login.login")}
            </CustomHeading>

            <LoginForm />
          </LoginContentContainer>
        </LoginSubContainer>

        <LoginSubContainer>
          <ImageWithGradient
            imageUrl={imageUrl}
            gradientClass={gradientClassName}
          />
        </LoginSubContainer>
      </LoginContainer>
    </PageLayout>
  );
}
