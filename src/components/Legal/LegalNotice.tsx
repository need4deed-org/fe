"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "../Layout";
import styled from "styled-components";
import Link from "next/link";

function LegalNotice() {
  const { t } = useTranslation();

  const LegalContainer = styled.div.attrs({ className: "n4d-container" })`
    font-size: var(--font-size-xs);
    line-height: 2;
    margin: 0;
    margin-inline: auto;
    max-width: min(90vw, 1080px);
    padding: min(2vw, 40px);
    & h2,
    h6 {
      color: var(--color-neutral-200);
    }
    & p {
      text-align: justify;
    }
  `;

  const LegalTitle = styled.h2`
    margin-bottom: var(--space-xl);
  `;

  const LegalSection = styled.div`
    margin-bottom: var(--space-xl);
    & p {
      margin: 0;
    }
    & span {
      font-weight: var(--font-weight-bold);
    }
  `;

  const StyledLink = styled(Link)`
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color 0.2s ease;
    color: var(--color-black);
    &:hover {
      text-decoration: underline;
    }
  `;
  return (
    <PageLayout background="var(--color-orchid)">
      <LegalContainer>
        <LegalTitle>{t("legal.notice.header")}</LegalTitle>
        <LegalSection>
          <p>CLUB DIALOG e.V.</p>
          <p>Lindower Straße 18</p>
          <p>13347 Berlin-Wedding</p>
          <p>
            <span>{t("legal.notice.contacts.tel")}</span>: +49 30 2044859
          </p>
          <p>
            <span>{t("legal.notice.contacts.fax")}</span>: +49 30 2044610
          </p>
          <p>
            <span>{t("legal.notice.contacts.email")}</span>: info@club-dialog.de
          </p>
          <p>
            <span>{t("legal.notice.contacts.responsible")}</span>, Dr. Natalia Roesler
          </p>
        </LegalSection>
        <h6>
          {t("legal.notice.registration")}: VR 10876 Nz <span>{t("legal.notice.court")}</span>
        </h6>
        <h6>{t("legal.notice.disclaimer")}</h6>
        <h6>{t("legal.notice.liability.header")}</h6>
        <p>{t("legal.notice.liability.body")}</p>
        <h6>{t("legal.notice.photoCredit.header")}</h6>
        <ul>
          <li>Google Maps</li>
          <li>{t("legal.notice.photoCredit.owner")}</li>
          <li>Adobe Stock</li>
        </ul>
        <p>{t("legal.notice.photoCredit.clubDialog")}</p>
        <StyledLink href="/data-protection">{t("legal.notice.dataProtectionLink")}</StyledLink>
        <h6>{t("legal.notice.dataProtectionOfficer")}</h6>
        <LegalSection>
          <p>WS Datenschutz GmbH</p>
          <p>Dircksenstraße 51</p>
          <p>10178 Berlin</p>
          <p>clubdialog@ws-datenschutz.de</p>
        </LegalSection>
      </LegalContainer>
    </PageLayout>
  );
}

export default LegalNotice;
