import { useParams } from "next/navigation";
import type { Lang } from "need4deed-sdk";
import { resolveLanguage } from "@/utils/helpers";

// The `[lang]` route segment as a supported language (the middleware guarantees one under `[lang]`).
export const useRouteLang = (): Lang => resolveLanguage(useParams<{ lang?: string }>()?.lang);
