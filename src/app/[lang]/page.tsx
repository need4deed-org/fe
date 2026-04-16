import { Landing } from "@/components/Website/Landing";
import { Lang } from "need4deed-sdk";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const lang = (await params).lang;

  return <Landing lang={lang as Lang} />;
}
