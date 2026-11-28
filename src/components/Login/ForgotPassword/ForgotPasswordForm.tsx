import { ROUTES } from "@/constants/routes";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathRequestPasswordReset } from "@/config/constants";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EmailButtonDiv, StyledForm } from "../styles";
import { createForgotPasswordSchema, ForgotPasswordFormData } from "./forgotPasswordSchema";

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

type Props = {
  onSuccess: () => void;
};

const useRequestPasswordResetMutation = (onResetSuccess: () => void) => {
  return useMutationQuery<ForgotPasswordData, ForgotPasswordResponse>({
    apiPath: apiPathRequestPasswordReset,
    successMessage: "dashboard.login.successEmailLinkMessage",
    onSuccessCallback: async () => {
      onResetSuccess();
    },
  });
};

export function ForgotPasswordForm({ onSuccess }: Props) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordResetMutation(onSuccess);
  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });
  const canSubmit = Object.keys(errors).length === 0 && !isPending;

  return (
    <StyledForm
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit((values) => requestPasswordReset(values))(e);
      }}
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            type="email"
            name="email"
            autoComplete="username"
            value={field.value}
            onInputChange={field.onChange}
            onBlur={field.onBlur}
            placeHolder={t("dashboard.login.email")}
            errors={fieldState.error?.message ? [fieldState.error.message] : []}
          />
        )}
      />
      <EmailButtonDiv>
        <Button
          type="submit"
          text={t("dashboard.login.sendEmail")}
          backgroundcolor={canSubmit ? "var(--color-aubergine)" : "var(--color-grey-50)"}
          textColor={canSubmit ? "var(--color-white)" : "var(--color-grey-400)"}
          textHoverColor="var(--color-magnolia)"
          disabled={!canSubmit}
        />
        <Link href={ROUTES.login(lang)}>{t("dashboard.login.backToLogin")}</Link>
      </EmailButtonDiv>
    </StyledForm>
  );
}
