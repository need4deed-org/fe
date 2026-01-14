import { apiPathMe } from "@/config/constants";
import axios from "axios";
import { ApiUserGet } from "need4deed-sdk";

export const getAuthUser = async (): Promise<ApiUserGet | null> => {
  try {
    const response = await axios.get(apiPathMe);
    return response.data;
  } catch {
    return null;
  }
};
