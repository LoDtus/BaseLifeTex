import { useState } from "react";
import HomeHeader from "../../components/common/HomeHeader";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import styles from "../styles/MainLayout.module.scss";

export default function HomeLayout({ children }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ THÊM DÒNG NÀY

    return (
        <div className="">
            <div className={styles.header}>
            <HomeHeader
                setSearchTerm={setSearchTerm}
                toggleSidebar={() => setIsSidebarOpen(prev => !prev)} // ✅ truyền hàm toggle
            />
            </div>
            <div className={styles.wrapContent}>
                {isSidebarOpen && ( // ✅ Kiểm tra biến đã khai báo
                    <div className={styles.navbar}>
                        <NavigationBar searchTerm={searchTerm} />
                    </div>
                )}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
