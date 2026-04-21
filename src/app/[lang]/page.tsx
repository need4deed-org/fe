import { Landing } from "@/components/Website/Landing";
import { Lang } from "need4deed-sdk";
import { use } from "react";

export default function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = use(params);

  return <Landing lang={lang as Lang} />;
}
