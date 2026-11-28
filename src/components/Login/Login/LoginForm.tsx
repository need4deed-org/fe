import { ROUTES } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useId, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInput } from "../../core/common";
import { Button, Checkbox } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin, LOGIN_ERROR_KEYS, LOGIN_ERROR_TOAST_ID } from "@/config/constants";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormActions } from "../styles";
import { FieldGroup, FieldLabel, LoginFormLayout, SubmitRow } from "./login-styles";
import { createLoginSchema, LoginFormData } from "./loginSchema";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

const useLoginMutation = (onLoginSuccess: () => void) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  return useMutationQuery<LoginData, LoginResponse>({
    apiPath: apiPathLogin,
    successMessage: "dashboard.login.successMessage",
    onSuccessCallback: async () => {
      onLoginSuccess();
    },
    onErrorCallback: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const key = status ? LOGIN_ERROR_KEYS[status] : undefined;
      if (!key) return false;
      const message =
        status === 401 ? (
          <span>
            {t(key)} <Link href={ROUTES.forgotPassword(lang)}>{t("dashboard.login.forgotPassword")}?</Link>
          </span>
        ) : (
          t(key)
        );
      if (toast.isActive(LOGIN_ERROR_TOAST_ID)) {
        toast.update(LOGIN_ERROR_TOAST_ID, { render: message, type: "error" });
      } else {
        toast.error(message, { toastId: LOGIN_ERROR_TOAST_ID });
      }
      return true;
    },
  });
};

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const { mutate: login, isPending } = useLoginMutation(onLoginSuccess);
  const fieldId = useId();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const schema = useMemo(() => createLoginSchema(t), [t]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const canSubmit = Object.keys(errors).length === 0 && !isPending;

  return (
    <LoginFormLayout
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit((values) => login(values))(e);
      }}
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <FieldLabel htmlFor={`${fieldId}-email`}>{t("dashboard.login.email")}</FieldLabel>
            <FormInput
              id={`${fieldId}-email`}
              type="email"
              name="email"
              autoComplete="username"
              value={field.value}
              onInputChange={field.onChange}
              onBlur={field.onBlur}
              placeHolder=""
              errors={fieldState.error?.message ? [fieldState.error.message] : []}
            />
          </FieldGroup>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <FieldLabel htmlFor={`${fieldId}-password`}>{t("dashboard.login.password")}</FieldLabel>
            <FormInput
              id={`${fieldId}-password`}
              type="password"
              name="password"
              autoComplete="current-password"
              value={field.value}
              onInputChange={field.onChange}
              onBlur={field.onBlur}
              placeHolder=""
              errors={fieldState.error?.message ? [fieldState.error.message] : []}
            />
          </FieldGroup>
        )}
      />

      <FormActions>
        <Checkbox
          checked={rememberMeChecked}
          onChange={() => setRememberMeChecked(!rememberMeChecked)}
          height="24px"
          width="24px"
          label={t("dashboard.login.rememberMe")}
          labelFontSize="var(--dashboard-login-checkbox-label-fontSize)"
        />
        <Link href={ROUTES.forgotPassword(lang)}>{t("dashboard.login.forgotPassword")}?</Link>
      </FormActions>

      <SubmitRow>
        <Button
          type="submit"
          width="100%"
          text={t("dashboard.login.login")}
          backgroundcolor={canSubmit ? "var(--color-aubergine)" : "var(--color-grey-50)"}
          textColor={canSubmit ? "var(--color-white)" : "var(--color-grey-400)"}
          textHoverColor="var(--color-magnolia)"
          disabled={!canSubmit}
        />
      </SubmitRow>
    </LoginFormLayout>
  );
};
