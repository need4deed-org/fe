import { Landing } from "@/components/Dashboard/Landing";
import { Lang } from "need4deed-sdk";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const lang = (await params).lang;

  if (![Lang.EN, Lang.DE].includes(lang)) {
    return null;
  }

  return <Landing />;
}
