import { AxiosInstance } from "axios";
import { toast } from "react-toastify";

let isRefreshing = false;

let failedQueue: { resolve: (token: string | null) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAxiosInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("Response error:", error);

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            console.log("Attempting to refresh token...");

            await axiosInstance.post("/auth/refresh");

            console.log("Token refreshed successfully");

            isRefreshing = false;
            processQueue(null);

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            isRefreshing = false;
            processQueue(refreshError);

            toast.error("Session expired. Please log in again.");

            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
