import Link from "next/link";
import { resolveLanguage, localizedPath } from "@/utils/helpers";
import styles from "./page.module.css";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = resolveLanguage((await params).lang);
  return (
    <div className={styles.page}>
      <header>HEADER</header>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <Link href={localizedPath(lang, "/login")} className={styles.secondary}>
            Login
          </Link>
          <Link href={localizedPath(lang, "/persons")} className={styles.secondary}>
            Persons
          </Link>
          <Link href={localizedPath(lang, "/forms/volunteer")} className={styles.secondary}>
            Volunteer form
          </Link>
          <Link href={localizedPath(lang, "/forms/opportunity")} className={styles.secondary}>
            Opportunity form
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>FOOTER</footer>
    </div>
  );
}
