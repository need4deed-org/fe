"use client";
import { tokenKey } from "@/config/constants";
import { useEffect, useState } from "react";

export default function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem(tokenKey);
      setToken(storedToken);
    }
  }, []);

  return {
    token,
    setToken: (newToken: string | null) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(tokenKey, newToken || "");
      }
      setToken(newToken);
    },
    clearToken: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(tokenKey);
      }
      setToken(null);
    },
  };
}
