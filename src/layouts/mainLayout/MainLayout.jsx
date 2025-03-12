import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children }) {
  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.wrapContent}>
        <div className={styles.navbar}>
          <Navbar />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
