import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <a href="/login" className={styles.secondary}>
            Login
          </a>
          <a href="/persons" className={styles.secondary}>
            Persons
          </a>
          <a href="/forms/volunteer" className={styles.secondary}>
            Volunteer form
          </a>
          <a href="/forms/opportunity" className={styles.secondary}>
            Opportunity form
          </a>
        </div>
      </main>
    </div>
  );
}
