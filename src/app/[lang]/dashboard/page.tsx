import { Landing } from "@/components/Dashboard/Landing";
import { TestimonialsSection } from "@/components/Testimonials";
import { Lang } from "need4deed-sdk";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function DashboardLandingPage({ params }: Props) {
  const { lang } = await params;
  return (
    <>
      <Landing />
      <TestimonialsSection lang={lang as Lang} />
    </>
  );
}
