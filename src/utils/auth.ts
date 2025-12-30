import { apiPathMe } from "@/config/constants";
import { ApiUserGet } from "need4deed-sdk";
import { cookies } from "next/headers";

export const getAuthUser = async (): Promise<ApiUserGet | null | undefined> => {
  try {
    const cookieStore = await cookies();

    const response = await fetch(apiPathMe, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 401) return null;
    if (!response.ok) throw new Error("Failed to get ApiUserGet");

    return response.json();
  } catch (error) {
    console.error("Auth Fetch Error:", error);
    return null;
  }
};
