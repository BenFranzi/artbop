import Link from "next/link";
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h3>Welcome to</h3>
      <h1>artbop.</h1>
      <Link href={'/bopit'}>bop it</Link>
    </main>
  );
}
