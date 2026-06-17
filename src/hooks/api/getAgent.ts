import { fetchFn } from "@/hooks/api/utils";
import { ApiAgentGet } from "need4deed-sdk";
import { apiPathAgent } from "@/config/constants";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

export const getServerAgent = async (cookieHeader: string, id: string): Promise<ApiAgentGet | null> => {
  try {
    const urlPath = apiPathAgent.replace("/api/", "");
    const response = await fetchFn<ApiResponse<ApiAgentGet>>({
      url: `${process.env.URL_API}/${urlPath}/${id}`,
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
