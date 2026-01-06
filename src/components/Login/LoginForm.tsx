import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { FormInput } from "../core/common";
import styled from "styled-components";
import { Button, Checkbox } from "../core/button";
import { Paragraph } from "../styled/text";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin } from "@/config/constants";
import { getAuthUser } from "@/utils/auth";
import { UserRole } from "need4deed-sdk";
import i18next from "i18next";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

const useLoginMutation = () => {
  const router = useRouter();
  const { language } = i18next;

  return useMutationQuery<LoginData, LoginResponse>({
    apiPath: apiPathLogin,
    successMessage: "dashboard.login.successMessage",
    onSuccessCallback: async () => {
      const user = await getAuthUser();
      if (user && user.role !== UserRole.USER) {
        router.push(`/${language}/dashboard?role=${user.role}&userId=${user.id}`);
      } else {
        router.push(`/${language}`);
      }
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

export const LoginForm = () => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLoginMutation();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login(value);
    },
  });

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => (!value ? t("dashboard.login.emailMissing") : undefined),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            // Simulating a network request for validation
            await new Promise((resolve) => setTimeout(resolve, 500));
            return value.includes("@") ? undefined : t("dashboard.login.emailMissingAtChar");
          },
        }}
      >
        {(field) => (
          <FormInput
            type="email"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.email")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => (!value ? t("dashboard.login.passwordMissing") : undefined),
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.password")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>

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
        <form.Subscribe selector={(state) => state}>
          {() => (
            <Button
              text={t("dashboard.login.login")}
              backgroundcolor="var(--color-grey-50)"
              textColor={"var(--color-grey-400)"}
              textHoverColor="var(--color-magnolia)"
              disabled={!form.state.canSubmit || isPending}
            />
          )}
        </form.Subscribe>
      </LoginButtonDiv>
    </StyledForm>
  );
};
