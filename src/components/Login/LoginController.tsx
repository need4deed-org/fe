import { apiPathMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import i18next from "i18next";
import { ApiUserGet, UserRole } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";

export function LoginController() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { language } = i18next;

  const { data: user } = useGetQuery<ApiUserGet>({
    queryKey: ["user"],
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: isLoggedIn,
  });
  useEffect(() => {
    if (user && "role" in user) {
      const path =
        user.role !== UserRole.USER ? `/${language}/dashboard?role=${user.role}&userId=${user.id}` : `/${language}`;

      router.push(path);
    } else {
      return;
    }
  }, [user, language, router]);

  return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
}
