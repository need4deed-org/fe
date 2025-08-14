import styled from "styled-components";
import { Button } from "../core/button";
import { useTranslation } from "react-i18next";

const LoginRegisterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--layout-static-page-header-buttons-gap);
`;

export function LoginRegister() {
  const { t } = useTranslation();
  return (
    <LoginRegisterContainer>
      <Button
        onClick={() => {}}
        text={t("dashboard.header.button.login")}
        height="var(--layout-static-page-header-button-height)"
        textFontSize="var(--layout-static-page-header-button-text-font-size)"
        backgroundcolor="var(--color-orchid-subtle)"
        border="var(--layout-static-page-header-button-border)"
        textColor="var(--color-aubergine)"
      />
      <Button
        onClick={() => {}}
        text={t("dashboard.header.button.joinVolunteer")}
        height="var(--layout-static-page-header-button-height)"
        textFontSize="var(--layout-static-page-header-button-text-font-size)"
      />
    </LoginRegisterContainer>
  );
}

export default LoginRegister;
