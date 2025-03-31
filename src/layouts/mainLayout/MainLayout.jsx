import { useState } from "react";
import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <div className={styles.header}>
      <Header setSearchTerm={setSearchTerm} />
      </div>
      <div className={styles.wrapContent}>
        <div className={styles.navbar}>
        <Navbar searchTerm={searchTerm} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
