import styled from "styled-components";
import { Button } from "../core/button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useRouteLang } from "@/hooks/use-route-lang";
import { localizedPath } from "@/utils/helpers";

const LoginRegisterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--layout-static-page-header-buttons-gap);
`;

export function LoginRegister() {
  const { t } = useTranslation();
  const lang = useRouteLang();
  const router = useRouter();

  return (
    <LoginRegisterContainer>
      <Button
        onClick={() => router.push(localizedPath(lang, "/login"))}
        text={t("dashboard.header.button.login")}
        height="var(--layout-static-page-header-button-height)"
        textFontSize="var(--layout-static-page-header-button-text-font-size)"
        backgroundcolor="var(--color-orchid-subtle)"
        border="var(--layout-static-page-header-button-border)"
        textColor="var(--color-aubergine)"
      />
    </LoginRegisterContainer>
  );
}

export default LoginRegister;
