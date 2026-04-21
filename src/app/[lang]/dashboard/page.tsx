import { TestimonialsSection } from "@/components/Testimonials";
import { Landing } from "@/components/Website/Landing";
import { Lang } from "need4deed-sdk";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function DashboardLandingPage({ params }: Props) {
  const { lang } = await params;
  return (
    <>
      <Landing lang={lang as Lang} />
      <TestimonialsSection lang={lang as Lang} />
    </>
  );
}
