import { useParams } from "next/navigation";
import type { Lang } from "need4deed-sdk";
import { getRouteLanguage } from "@/utils/helpers";

export const useRouteLang = (): Lang => getRouteLanguage(useParams<{ lang?: string }>()?.lang);
