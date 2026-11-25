"use client";
import styled from "styled-components";
import { Logos } from "./Logos";
import { LinkList } from "./LinkList";
import { Link } from "@/types/Link";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import { N4DLogoIcon } from "@/components/svg/N4DLogoIcon";
import { Contact } from "./Contact";
import { Socials } from "./Socials";

export const Footer = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const links1: Link[] = [
    { route: ROUTES.about(language), label: t("website.footer.about") },
    { route: ROUTES.forOrganizations(language), label: t("website.footer.forOrganizations") },
    { route: ROUTES.faq(language), label: t("website.footer.faq") },
  ];
  const links2: Link[] = [
    { route: ROUTES.legal(language), label: t("website.footer.legal") },
    { route: ROUTES.privacy(language), label: t("website.footer.privacy") },
    { route: ROUTES.agreement(language), label: t("website.footer.agreement") },
  ];

  return (
    <Background>
      <Logos />
      <LinksBackground>
        <LinksContainer>
          <Logo />
          <Links1Wrapper>
            <LinkList links={links1} />
          </Links1Wrapper>
          <Links2Wrapper>
            <LinkList links={links2} />
          </Links2Wrapper>
          <Contact />
          <Socials />
        </LinksContainer>
      </LinksBackground>
    </Background>
  );
};

export const Background = styled.footer`
  background-color: var(--blue-100);
`;

const LinksBackground = styled.div`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  padding: var(--large-spacing);
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-areas:
    "logo links1 links2"
    ". contact socials";
  gap: var(--large-spacing);
  width: 100%;
  max-width: 700px;
  margin: auto;

  @media screen and (max-width: 700px) {
    grid-template-areas:
      "links1 logo"
      "links2 links2"
      "contact socials";
    width: auto;
  }

  @media screen and (max-width: 500px) {
    grid-template-areas:
      "links1 logo"
      "links2 links2"
      "contact contact"
      "socials socials";
  }
`;

const Logo = styled(N4DLogoIcon)`
  grid-area: logo;
  width: 70px;
  fill: var(--lavender-20);

  @media screen and (max-width: 700px) {
    justify-self: flex-end;
  }
`;

const Links1Wrapper = styled.div`
  grid-area: links1;
`;

const Links2Wrapper = styled.div`
  grid-area: links2;
`;
