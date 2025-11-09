import axios from "axios";

// Create a central axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API || "",
  withCredentials: true,
});

export default axiosInstance;
