import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>HEADER</header>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <a href="/login" className={styles.secondary}>
            Login
          </a>
          <a href="/opportunities" className={styles.secondary}>
            Opportunities
          </a>
        </div>
      </main>
      <footer className={styles.footer}>FOOTER</footer>
    </div>
  );
}
