import Link from "next/link";
import styles from "./page.module.css";
import { getAuthUser } from "@/utils/auth";
import { UserRole } from "need4deed-sdk";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const user = await getAuthUser();

  if (user && user.role !== UserRole.USER) {
    redirect(`/${lang}/dashboard?role=${user.role}&userId=${user.id}`);
  }

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
      <footer className={styles.footer}>FOOTER</footer>
    </div>
  );
}
