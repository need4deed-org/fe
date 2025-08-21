"use client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import styled from "styled-components";
import { PageLayout } from "../Layout";
import { CustomHeading, Paragraph } from "../styled/text";
import { FormInput } from "../core/common";
import { useState } from "react";
import { Button, Checkbox } from "../core/button";

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

const RememberMeForgotPassDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LoginDiv = styled.div`
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
  // const router = useRouter();

  // const { mutate: login } = useMutation<LoginResponse, Error, LoginData>({
  //   mutationFn: async (data: LoginData): Promise<LoginResponse> => {
  //     return fetch(urlLogin, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     }).then(async (res) => {
  //       const body = res.json();
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status} ${(await body).message}`);
  //       }
  //       return body;
  //     });
  //   },
  // });

  // const form = useForm({
  //   defaultValues: {
  //     email: "mysaraccoordinator@gmail.com",
  //     password: "N0lifeatall",
  //   },
  //   onSubmit: async ({ value }) => {
  //     login(value, {
  //       onSuccess: ({ message }) => {
  //         console.log("DEBUG:login:message", message);
  //         router.push("/");
  //       },
  //       onError: (err) => {
  //         console.error(err);
  //       },
  //     });
  //   },
  // });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  return (
    <PageLayout background="var(--color-white)">
      <LoginContainer>
        <LoginSubContainer>
          <LoginContentContainer>
            <CustomHeading
              fontWeight={600}
              fontSize="var(--dashboard-login-heading-fontSize)"
              lineheight="var(--dashboard-login-heading-lineHeight)"
              letterSpacing="var(--dashboard-login-heading-letterSpacing)"
              color="var(--color-midnight)"
            >
              Log in
            </CustomHeading>

            <FormInput onInputChange={setEmail} value={email} placeHolder="Email" />
            <FormInput onInputChange={setPassword} value={password} placeHolder="Password" />

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
              <Paragraph fontWeight={600} color="var(--color-midnight-light)">
                Forgot password?
              </Paragraph>
            </RememberMeForgotPassDiv>

            <LoginDiv>
              <Button
                text="Log in"
                onClick={() => {}}
                backgroundcolor="var(--color--grey-50)"
                textColor="var(--color--grey-400)"
                textHoverColor="var(--color-magnolia)"
              />
            </LoginDiv>
          </LoginContentContainer>
        </LoginSubContainer>

        <LoginSubContainer>
          <Paragraph>asdf</Paragraph>
          <Paragraph>werwertwert</Paragraph>
        </LoginSubContainer>
      </LoginContainer>
      ;
    </PageLayout>
  );

  // return (
  //   <div className={styles["login-container"]}>
  //     <h1>Login</h1>
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         e.stopPropagation();
  //         form.handleSubmit();
  //       }}
  //       className={styles["login-form"]}
  //     >
  //       <form.Field
  //         name="email"
  //         validators={{
  //           onBlur: ({ value }) => {
  //             return !value ? "Email's missing." : undefined;
  //           },
  //         }}
  //       >
  //         {(field) => (
  //           <>
  //             <label className={styles["login-form-element"]}>
  //               EMAIL:
  //               <input
  //                 type="email"
  //                 name={field.name}
  //                 value={field.state.value}
  //                 onChange={(e) => field.handleChange(e.target.value)}
  //               />
  //             </label>
  //           </>
  //         )}
  //       </form.Field>
  //       <form.Field
  //         name="password"
  //         validators={{
  //           onBlur: ({ value }) => {
  //             return !value ? "Password's missing." : undefined;
  //           },
  //         }}
  //       >
  //         {(field) => (
  //           <>
  //             <label className={styles["login-form-element"]}>
  //               PASSWORD:
  //               <input
  //                 type="password"
  //                 name={field.name}
  //                 value={field.state.value}
  //                 onChange={(e) => field.handleChange(e.target.value)}
  //               />
  //             </label>
  //           </>
  //         )}
  //       </form.Field>
  //       <form.Subscribe selector={(state) => state}>
  //         {(state) => (
  //           <>
  //             <button type="submit" disabled={!state.canSubmit}>
  //               {"login".toUpperCase()}
  //             </button>
  //             {!!state.errors.length && <p>ERRORS: {state.errors.join(", ")}</p>}
  //           </>
  //         )}
  //       </form.Subscribe>
  //     </form>
  //   </div>
  // );
}

export default Login;
