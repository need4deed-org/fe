import { Button } from "@/components/fields/Button";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks/useLogout";

export const LogoutButton = () => {
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();

  return <Button inline label={t("dashboard.header.button.logout")} onClick={logout} />;
};
