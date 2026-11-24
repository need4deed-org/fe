import { apiPathEmailTemplates } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios, { AxiosError } from "axios";
import {
  ApiEmailTemplateGet,
  ApiEmailTemplateList,
  ApiEmailTemplatePut,
  ApiEmailTemplatePutResponse,
  ApiEmailTemplateSaveError,
  EmailTemplateName,
} from "need4deed-sdk";

const emailTemplatesQueryKey = ["email-templates"];

export const useEmailTemplates = () => {
  const { data, isLoading, isError } = useGetQuery<ApiEmailTemplateList>({
    queryKey: emailTemplatesQueryKey,
    apiPath: apiPathEmailTemplates,
    localeIndependent: true,
    toastOnError: false,
  });

  return { list: data, isLoading, isError };
};

export const useEmailTemplate = (name: EmailTemplateName | undefined) => {
  const { data, isLoading, isError, refetch } = useGetQuery<ApiEmailTemplateGet>({
    queryKey: [...emailTemplatesQueryKey, name ?? ""],
    apiPath: `${apiPathEmailTemplates}/${name}`,
    enabled: name !== undefined,
    localeIndependent: true,
    toastOnError: false,
  });

  return { template: data, isLoading, isError, refetch };
};

type SaveInput = { name: EmailTemplateName; body: ApiEmailTemplatePut };

export const useSaveEmailTemplate = ({
  onSaved,
  onSaveError,
}: {
  onSaved: (saved: ApiEmailTemplatePutResponse) => void;
  onSaveError: (error: ApiEmailTemplateSaveError) => void;
}) => {
  const { mutate: saveTemplate, isPending: isSaving } = useMutationQuery<SaveInput, ApiEmailTemplatePutResponse>({
    mutationFn: ({ name, body }) =>
      axios
        .put<{ data: ApiEmailTemplatePutResponse }>(`${apiPathEmailTemplates}/${name}`, body)
        .then((res) => res.data.data),
    successMessage: "dashboard.admin.emailTemplates.saved",
    queryKeyToInvalidate: emailTemplatesQueryKey,
    onSuccessCallback: onSaved,
    onErrorCallback: (error) => {
      const saveError = toSaveError(error);
      if (!saveError) return false;
      onSaveError(saveError);
      return true;
    },
  });

  return { saveTemplate, isSaving };
};

function toSaveError(error: unknown): ApiEmailTemplateSaveError | undefined {
  const data = (error as AxiosError<Partial<ApiEmailTemplateSaveError>>)?.response?.data;
  return axios.isAxiosError(error) && typeof data?.code === "string" && typeof data.message === "string"
    ? (data as ApiEmailTemplateSaveError)
    : undefined;
}
