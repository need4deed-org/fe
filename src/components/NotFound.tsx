"use client";
import styled from "styled-components";
import { LinkButton } from "./fields/LinkButton";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <Background>
      <Heading>404</Heading>
      <Message>{t("notFound.message")}</Message>
      <LinkButton inline href={ROUTES.home(language)} label={t("notFound.goHome")} />
    </Background>
  );
};

const Background = styled.div`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--small-spacing);
  width: 100dvw;
  height: 100dvh;
  background-color: var(--sand-20);
`;

const Heading = styled.h1`
  font-size: 44px;
  font-weight: var(--bold);
`;

const Message = styled.p`
  font-weight: var(--bold);
`;
