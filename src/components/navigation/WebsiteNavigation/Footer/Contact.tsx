"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { EMAILS } from "@/constants/emails";

export const Contact = () => {
  const { t } = useTranslation();

  return (
    <Background>
      <Heading>{t("website.footer.contact")}</Heading>
      <Link href={`mailto: ${EMAILS.contact}`}>{EMAILS.contact}</Link>
    </Background>
  );
};

const Background = styled.div`
  grid-area: contact;
`;

const Heading = styled.h5`
  margin-bottom: var(--small-spacing);
  color: var(--lavender-20);
  font-weight: var(--bold);
`;

const Link = styled(NextLink)`
  color: var(--lavender-20);
`;
