"use client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { PageLayout } from "../Layout";
import { CustomHeading, Paragraph } from "../styled/text";
import { FormInput } from "../core/common";
import { Checkbox, Button } from "../core/button";
import { useState } from "react";

const urlLogin = "/api/auth/login";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: var(--dashboard-login-container-height);
`;

const LoginSubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const LoginContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--dashboard-login-content-container-width);
  gap: var(--dashboard-login-content-container-gap);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-login-content-container-gap);
`;

const RememberMeForgotPassDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LoginButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

export function Login() {
  const router = useRouter();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const { mutate: login } = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      return fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const body = res.json();
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} ${(await body).message}`);
        }
        return body;
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login(value, {
        onSuccess: ({ message }) => {
          console.log("DEBUG:login:message", message);
          router.push("/");
        },
        onError: (err) => {
          console.error(err);
        },
      });
    },
  });

  return (
    <PageLayout background="var(--color-white)">
      <LoginContainer>
        <LoginSubContainer>
          <LoginContentContainer>
            <CustomHeading
              fontWeight="var(--dashboard-login-heading-fontWeight)"
              fontSize="var(--dashboard-login-heading-fontSize)"
              lineheight="var(--dashboard-login-heading-lineHeight)"
              letterSpacing="var(--dashboard-login-heading-letterSpacing)"
              color="var(--color-midnight)"
            >
              Log in
            </CustomHeading>

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
                  onChange: ({ value }) => (!value ? "Email's missing." : undefined),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return value.includes("@") ? undefined : "Email must contain an '@' character.";
                  },
                }}
              >
                {(field) => (
                  <FormInput
                    type="email"
                    value={field.state.value}
                    onInputChange={(val) => field.handleChange(val)}
                    placeHolder="Email"
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    return !value ? "Password's missing." : undefined;
                  },
                }}
              >
                {(field) => (
                  <FormInput
                    type="password"
                    value={field.state.value}
                    onInputChange={(val) => field.handleChange(val)}
                    placeHolder="Password"
                    errors={field.state.meta.errors}
                  />
                )}
              </form.Field>

              <RememberMeForgotPassDiv>
                <Checkbox
                  checked={rememberMeChecked}
                  onChange={() => setRememberMeChecked(!rememberMeChecked)}
                  // !Reason for fixed value: var() definition is not working for SVGs and a value should be given for initial SSR.
                  height="24px"
                  width="24px"
                  label="Remember Me"
                  labelFontSize="var(--dashboard-login-checkbox-label-fontSize)"
                />
                <Paragraph
                  fontWeight="var(--dashboard-login-forgot-password-label-fontWeight)"
                  color="var(--color-midnight-light)"
                >
                  Forgot password?
                </Paragraph>
              </RememberMeForgotPassDiv>

              <LoginButtonDiv>
                <form.Subscribe selector={(state) => state}>
                  {() => (
                    <Button
                      text="Log in"
                      backgroundcolor="var(--color-grey-50)"
                      textColor={"var(--color-grey-400)"}
                      textHoverColor="var(--color-magnolia)"
                      onClick={() => {}}
                    />
                  )}
                </form.Subscribe>
              </LoginButtonDiv>
            </StyledForm>
          </LoginContentContainer>
        </LoginSubContainer>

        <LoginSubContainer>
          <Paragraph>asdf</Paragraph>
          <Paragraph>werwertwert</Paragraph>
        </LoginSubContainer>
      </LoginContainer>
    </PageLayout>
  );
}
