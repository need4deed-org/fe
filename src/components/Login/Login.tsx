"use client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import styled from "styled-components";
import { DashboardLayout, PageLayout } from "../Layout";
import { CustomHeading, Paragraph } from "../styled/text";
import { FormInput } from "../core/common";
import { useState } from "react";

const urlLogin = "/api/auth/login";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 944px;
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
  gap: 32px;
  width: 638px;
`;

const RememberMeForgotPassDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RememberMeDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
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

  return (
    <PageLayout background="var(--color-white)">
      <LoginContainer>
        <LoginSubContainer>
          <LoginContentContainer>
            <CustomHeading fontWeight={600} fontSize="48px" lineheight="52px" letterSpacing="0.5px">
              Log in
            </CustomHeading>

            <FormInput onInputChange={setEmail} value={email} placeHolder="Email" />
            <FormInput onInputChange={setPassword} value={password} placeHolder="Password" />
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
