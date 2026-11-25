import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FormInput, VisuallyHiddenInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { apiPathPasswordReset } from "@/config/constants";
import { createResetPasswordSchema, ResetPasswordFormData } from "./resetPasswordSchema";
import { StyledForm } from "../styles";
import { decodeJwtPayload } from "@/utils/helpers";

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

interface ResetPasswordResponse {
  message: string;
}

type Props = {
  onResetSuccess: () => void;
};

const useResetPasswordMutation = (onResetSuccess: () => void) => {
  return useMutationQuery<ResetPasswordData, ResetPasswordResponse>({
    apiPath: apiPathPasswordReset,
    successMessage: "dashboard.login.successResetPasswordMessage",
    onSuccessCallback: async () => {
      onResetSuccess();
    },
  });
};

export function ResetPasswordForm({ onResetSuccess }: Props) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const urlTokenParam = searchParams.get("token");
  const email: string = useMemo(() => (urlTokenParam && decodeJwtPayload(urlTokenParam)?.email) || "", [urlTokenParam]);
  const { mutate: resetPassword, isPending } = useResetPasswordMutation(onResetSuccess);
  const schema = useMemo(() => createResetPasswordSchema(t), [t]);
  const {
    control,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const canSubmit = Object.keys(errors).length === 0 && !isPending;

  return (
    <StyledForm
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit((values) => resetPassword({ ...values, token: urlTokenParam || "" }))(e);
      }}
    >
      {email && (
        <VisuallyHiddenInput
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            type="password"
            name="newPassword"
            autoComplete="new-password"
            value={field.value}
            onInputChange={(value) => {
              field.onChange(value);
              if (getFieldState("confirmPassword").isTouched) trigger("confirmPassword");
            }}
            onBlur={field.onBlur}
            placeHolder={t("dashboard.login.newPassword")}
            errors={fieldState.error?.message ? [fieldState.error.message] : []}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={field.value}
            onInputChange={field.onChange}
            onBlur={field.onBlur}
            placeHolder={t("dashboard.login.confirmPassword")}
            errors={fieldState.error?.message ? [fieldState.error.message] : []}
          />
        )}
      />
      <Button
        type="submit"
        text={t("dashboard.login.resetPassword")}
        backgroundcolor={canSubmit ? "var(--color-aubergine)" : "var(--color-grey-50)"}
        textColor={canSubmit ? "var(--color-white)" : "var(--color-grey-400)"}
        textHoverColor="var(--color-magnolia)"
        disabled={!canSubmit}
      />
    </StyledForm>
  );
}
