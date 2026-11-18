import styled from "styled-components";
import { LogoN4D } from "../logos";
import ContactSocials from "./ContactSocials";
import FooterLinks from "./FooterLinks";
import { Link } from "./FooterLinks";
import { useTranslation } from "react-i18next";
import { routes } from "@/constants/routes";

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "links1 logo"
    "links2 links2"
    "contact contact";
  align-content: space-between;
  height: var(--homepage-footer-partners-section-footer-container-height);

  @media (max-width: 359px) {
    height: auto;
    row-gap: 32px;
  }

  @media (min-width: 768px) {
    display: flex;
    flex-direction: var(--homepage-footer-partners-section-footer-container-flex-direction);
    justify-content: var(--homepage-footer-partners-section-footer-container-justify-content);
    gap: var(--homepage-footer-partners-section-footer-container-gap);
  }
`;

const LogoSlot = styled.div`
  display: flex;
  grid-area: logo;
`;

const LinksContainer = styled.div`
  display: contents;

  & > :last-child {
    grid-area: contact;
  }

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: var(--homepage-footer-partners-section-footer-links-container-width);
  }

  @media (min-width: 1440px) {
    flex-direction: row;
  }
`;

const LinksRow = styled.div`
  display: contents;

  & > :first-child {
    grid-area: links1;
    justify-self: start;
  }

  & > :last-child {
    grid-area: links2;
  }

  @media (min-width: 768px) and (max-width: 1439px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: var(--homepage-footer-partners-section-footer-links-container-width);
  }
`;

export function Footer() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const links1: Link[] = [
    { route: routes.about(language), label: t("website.footer.about") },
    { route: routes.forOrganizations(language), label: t("website.footer.forOrganizations") },
    { route: routes.faq(language), label: t("website.footer.faq") },
  ];
  const links2: Link[] = [
    { route: routes.legal(language), label: t("website.footer.legalNotice") },
    { route: routes.privacy(language), label: t("website.footer.privacy") },
    { route: routes.agreement(language), label: t("website.footer.vpa") },
  ];

  return (
    <FooterContainer>
      <LogoSlot>
        <LogoN4D />
      </LogoSlot>
      <LinksContainer>
        <LinksRow>
          <FooterLinks links={links1} />
          <FooterLinks links={links2} />
        </LinksRow>
        <ContactSocials />
      </LinksContainer>
    </FooterContainer>
  );
}

export default Footer;
