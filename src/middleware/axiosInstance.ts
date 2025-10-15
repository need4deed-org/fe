import axios from "axios";
import { setupAxiosInterceptors } from "./authMiddleware";

// Create a central axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API || "",
  withCredentials: true,
});

const configuredAxios = setupAxiosInterceptors(axiosInstance);

export default configuredAxios;
