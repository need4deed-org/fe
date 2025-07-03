"use client";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { setToken } from "../../../public/utils/api";
import styles from "./index.module.css";

const urlLogin = "/api/auth/login";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

export default function Login() {
  const { mutate: login } = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      return fetch(urlLogin, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const body = res.json();
        if (!res.ok) {
          throw new Error(
            `HTTP error! status: ${res.status} ${(await body).message}`,
          );
        }
        return body;
      });
    },
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      login(value, {
        onSuccess: ({ data, message }) => {
          console.log("DEBUG:login:message", message);
          setToken(data.token);
        },
        onError: (err) => {
          console.error(err);
        },
      });
    },
  });

  return (
    <div className={styles["login-container"]}>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className={styles["login-form"]}
      >
        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              return !value ? "Email's missing." : undefined;
            },
          }}
        >
          {(field) => (
            <>
              <label className={styles["login-form-element"]}>
                EMAIL:
                <input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            </>
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onBlur: ({ value }) => {
              return !value ? "Password's missing." : undefined;
            },
          }}
        >
          {(field) => (
            <>
              <label className={styles["login-form-element"]}>
                PASSWORD:
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            </>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state}>
          {(state) => (
            <>
              <button type="submit" disabled={!state.canSubmit}>
                {"login".toUpperCase()}
              </button>
              {!!state.errors.length && (
                <p>ERRORS: {state.errors.join(", ")}</p>
              )}
              <pre>{JSON.stringify(state, null, 4)}</pre>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
