import { Landing } from "@/components/Dashboard/Landing";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
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
          {/* Reders Landing Layout */}
          <Landing />
        </div>
      </main>
      <footer className={styles.footer}>FOOTER</footer>
    </div>
  );
}
