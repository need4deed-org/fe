import { useCurrentUser } from "@/hooks/useCurrentUser";
import i18next from "i18next";
import { UserRole } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { LOGGED_IN_COOKIE } from "@/config/constants";

export function LoginController() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { language } = i18next;

  const user = useCurrentUser(isLoggedIn);
  useEffect(() => {
    if (!(user && "role" in user)) return;
    const path =
      user.role !== UserRole.USER ? `/${language}/dashboard/home?role=${user.role}&userId=${user.id}` : `/${language}`;
    router.push(path);
  }, [user, language, router]);

  return (
    <LoginForm
      onLoginSuccess={() => {
        document.cookie = LOGGED_IN_COOKIE;
        setIsLoggedIn(true);
      }}
    />
  );
}
