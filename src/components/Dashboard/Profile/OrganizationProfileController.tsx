import { apiPathOrganization, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOrganizationGet } from "need4deed-sdk";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";

type Props = {
  entityId: string;
};

export const OrganizationProfileController = ({ entityId }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiOrganizationGet>({
    queryKey: ["organization", entityId],
    apiPath: `${apiPathOrganization}${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="organization">
      {data && <ProfilePage organization={data} />}
    </LoadingErrorWrapper>
  );
};
