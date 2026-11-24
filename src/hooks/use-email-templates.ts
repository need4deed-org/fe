import { apiPathEmailTemplates } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ApiEmailTemplateGet,
  ApiEmailTemplateList,
  ApiEmailTemplatePut,
  ApiEmailTemplatePutResponse,
  ApiEmailTemplateSaveError,
  EmailTemplateName,
  EmailTemplateSaveErrorCode,
} from "need4deed-sdk";

const emailTemplatesQueryKey = ["email-templates"];

export const useEmailTemplates = () => {
  const { data, isLoading } = useGetQuery<ApiEmailTemplateList>({
    queryKey: emailTemplatesQueryKey,
    apiPath: apiPathEmailTemplates,
    localeIndependent: true,
    toastOnError: false,
  });

  return { list: data, isLoading };
};

export const useEmailTemplate = (name: EmailTemplateName | undefined) => {
  const { data, isLoading } = useGetQuery<ApiEmailTemplateGet>({
    queryKey: [...emailTemplatesQueryKey, name ?? ""],
    apiPath: `${apiPathEmailTemplates}/${name}`,
    enabled: name !== undefined,
    localeIndependent: true,
    toastOnError: false,
  });

  return { template: data, isLoading };
};

export const useReloadEmailTemplate = () => {
  const queryClient = useQueryClient();
  return (name: EmailTemplateName) => queryClient.invalidateQueries({ queryKey: [...emailTemplatesQueryKey, name] });
};

type SaveInput = { name: EmailTemplateName; body: ApiEmailTemplatePut };

export const useSaveEmailTemplate = ({
  onSaved,
  onSaveError,
}: {
  onSaved: (saved: ApiEmailTemplatePutResponse) => void;
  onSaveError: (error: ApiEmailTemplateSaveError) => void;
}) => {
  const reload = useReloadEmailTemplate();
  const { mutate: saveTemplate, isPending: isSaving } = useMutationQuery<SaveInput, ApiEmailTemplatePutResponse>({
    mutationFn: ({ name, body }) =>
      axios
        .put<{ data: ApiEmailTemplatePutResponse }>(`${apiPathEmailTemplates}/${name}`, body)
        .then((res) => res.data.data),
    successMessage: "dashboard.admin.emailTemplates.saved",
    queryKeyToInvalidate: emailTemplatesQueryKey,
    onSuccessCallback: onSaved,
    onErrorCallback: (error, { name }) => {
      const saveError = toSaveError(error);
      if (!saveError) return false;
      if (saveError.code === "version_conflict") {
        reload(name);
      }
      onSaveError(saveError);
      return true;
    },
  });

  return { saveTemplate, isSaving };
};

const saveErrorCodes: Record<EmailTemplateSaveErrorCode, true> = {
  not_editable: true,
  version_conflict: true,
  layout_not_allowed: true,
  missing_placeholder: true,
  unknown_placeholder: true,
  blank_field: true,
  unknown_label: true,
};

const isSaveErrorCode = (code: unknown): code is EmailTemplateSaveErrorCode =>
  typeof code === "string" && Object.hasOwn(saveErrorCodes, code);

function toSaveError(error: unknown): ApiEmailTemplateSaveError | undefined {
  if (!axios.isAxiosError<Partial<ApiEmailTemplateSaveError>>(error)) return undefined;
  const data = error.response?.data;
  return isSaveErrorCode(data?.code) && typeof data.message === "string"
    ? (data as ApiEmailTemplateSaveError)
    : undefined;
}
