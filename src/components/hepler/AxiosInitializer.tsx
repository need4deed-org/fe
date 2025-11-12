"use client";

import "@/config/axios";
import { useEffect } from "react";

export default function AxiosInitializer() {
  useEffect(() => {
    console.log("Axios interceptors initialized on the client.");
  }, []);

  return null;
}
