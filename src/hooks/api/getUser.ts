import { fetchFn } from "@/hooks/api/utils";
import { ApiUserGet, UserRole } from "need4deed-sdk";
import { apiPathMe } from "@/config/constants";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

export const getServerUser = async (cookieHeader: string): Promise<ApiUserGet | null> => {
  try {
    const urlPath = apiPathMe.replace("/api/", "");
    const response = await fetchFn<ApiResponse<ApiUserGet>>({
      url: `${process.env.URL_API}/${urlPath}`,
      options: {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch server user role:", error);
    return null;
  }
};
