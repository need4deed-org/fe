import axiosInstance from "@/middleware/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Lang, SortOrder } from "need4deed-sdk";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const fetchData = async <T,>(apiPath: string, page?: number, limit?: number, language?: Lang, sort?: SortOrder) => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(apiPath, {
    params: {
      page,
      limit,
      language,
      sort,
    },
  });
  return response.data;
};

interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

interface UseGetQuery {
  apiPath: string;
  queryKey: string[];
  options?: { page?: number; limit?: number; staleTime?: number; sortOrder?: SortOrder };
}

// The generic custom hook with pagination-sort-language params
export const useGetQuery = <T,>({ queryKey, apiPath, options }: UseGetQuery) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as Lang;
  const { page, limit, staleTime, sortOrder } = options || {};

  const { data, isLoading, isError, error } = useQuery<ApiResponse<T>, Error>({
    queryKey: [...queryKey, { page, limit, language, sortOrder }],
    queryFn: () => fetchData<T>(apiPath, page, limit, language, sortOrder),
    staleTime,
  });

  // Display a toast message when an error occurs
  useEffect(() => {
    if (isError) {
      let errorMessage = t("message.errorGeneric");

      if (error && axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage = errorData?.message || errorData;
      } else if (error) {
        // Fallback for non-Axios errors
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  return {
    data: data?.data,
    message: data?.message || "",
    count: data?.count || 0,
    isLoading,
    isError,
    error,
  };
};
