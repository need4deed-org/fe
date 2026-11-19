import { useParams } from "next/navigation";
import type { Lang } from "need4deed-sdk";
import { resolveLanguage } from "@/utils/helpers";

export const useRouteLang = (): Lang => resolveLanguage(useParams<{ lang?: string }>()?.lang);
