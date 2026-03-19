import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../core/common";
import styled from "styled-components";
import { Button, Checkbox } from "../core/button";
import { Paragraph } from "../styled/text";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin } from "@/config/constants";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

const useLoginMutation = (onLoginSuccess: () => void) => {
  return useMutationQuery<LoginData, LoginResponse>({
    apiPath: apiPathLogin,
    successMessage: "dashboard.login.successMessage",
    onSuccessCallback: async () => {
      onLoginSuccess();
    },
  });
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-login-content-container-gap);
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LoginButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLoginMutation(onLoginSuccess);
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const methods = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginData) => {
    login(data);
  };

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void methods.handleSubmit(onSubmit)();
      }}
    >
      <Controller
        name="email"
        control={methods.control}
        rules={{
          required: t("dashboard.login.emailMissing"),
          validate: async (value: string) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return value.includes("@") || t("dashboard.login.emailMissingAtChar");
          },
        }}
        render={({ field, fieldState }) => (
          <FormInput
            type="email"
            value={field.value ?? ""}
            onInputChange={(v: string) => field.onChange(v)}
            placeHolder={t("dashboard.login.email")}
            errors={fieldState.error ? [String(fieldState.error.message ?? fieldState.error)] : []}
          />
        )}
      />

      <Controller
        name="password"
        control={methods.control}
        rules={{ required: t("dashboard.login.passwordMissing") }}
        render={({ field, fieldState }) => (
          <FormInput
            type="password"
            value={field.value ?? ""}
            onInputChange={(v: string) => field.onChange(v)}
            placeHolder={t("dashboard.login.password")}
            errors={fieldState.error ? [String(fieldState.error.message ?? fieldState.error)] : []}
          />
        )}
      />

      <FormActions>
        <Checkbox
          checked={rememberMeChecked}
          onChange={() => setRememberMeChecked(!rememberMeChecked)}
          // !Reason for fixed value: var() definition is not working for SVGs and a value should be given for initial SSR.
          height="24px"
          width="24px"
          label={t("dashboard.login.rememberMe")}
          labelFontSize="var(--dashboard-login-checkbox-label-fontSize)"
        />
        <Paragraph
          fontWeight="var(--dashboard-login-forgot-password-label-fontWeight)"
          color="var(--color-midnight-light)"
        >
          {t("dashboard.login.forgotPassword")}?
        </Paragraph>
      </FormActions>

      <LoginButtonDiv>
        <Button
          type="submit"
          text={t("dashboard.login.login")}
          backgroundcolor={methods.formState.isValid && !isPending ? "var(--color-aubergine)" : "var(--color-grey-50)"}
          textColor={methods.formState.isValid && !isPending ? "var(--color-white)" : "var(--color-grey-400)"}
          textHoverColor="var(--color-magnolia)"
          disabled={!methods.formState.isValid || isPending}
        />
      </LoginButtonDiv>
    </StyledForm>
  );
};
