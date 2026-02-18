import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";

type Props = {
  entityId: string;
};

export const OpportunityProfileController = ({ entityId }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiOpportunityGet>({
    queryKey: ["opportunity", entityId],
    apiPath: `${apiPathOpportunity}/${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="opportunity">
      {data && <ProfilePage opportunity={data} />}
    </LoadingErrorWrapper>
  );
};
