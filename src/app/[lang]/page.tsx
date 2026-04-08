import Link from "next/link";
import styles from "./page.module.css";
import { TestimonialsSection } from "@/components/Testimonials";
import { Lang } from "need4deed-sdk";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const lang = (await params).lang;
  return (
    <div className={styles.page}>
      <header>HEADER</header>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <Link href="/login" className={styles.secondary}>
            Login
          </Link>
          <Link href="/persons" className={styles.secondary}>
            Persons
          </Link>
          <Link href="/forms/volunteer" className={styles.secondary}>
            Volunteer form
          </Link>
          <Link href="/forms/opportunity" className={styles.secondary}>
            Opportunity form
          </Link>
        </div>
      </main>
      <TestimonialsSection lang={lang as Lang} />
      <footer className={styles.footer}>FOOTER</footer>
    </div>
  );
}
