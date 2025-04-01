import { useState } from "react";
import HomeHeader from "../../components/common/HomeHeader";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import styles from "../styles/MainLayout.module.scss";

export default function HomeLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <div className={styles.header}>
      <HomeHeader setSearchTerm={setSearchTerm} />
      </div>
      <div className={styles.wrapContent}>
        <div className={styles.navbar}>
        <NavigationBar searchTerm={searchTerm} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
