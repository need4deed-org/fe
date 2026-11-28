import { sameSitePath } from "@/utils/helpers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordController() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const next = sameSitePath(useSearchParams().get("next"));

  return <ResetPasswordForm onResetSuccess={() => router.push(next ?? `/${lang}/login`)} />;
}
