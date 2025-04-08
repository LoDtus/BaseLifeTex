import { useState, useEffect } from "react";
import HomeHeader from "../../components/common/HomeHeader";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import styles from "../styles/MainLayout.module.scss";
import { useSelector } from "react-redux";
import '@/components/navigation-bar/styles/navigation.css';

export default function HomeLayout({ children }) {
    const [searchTerm, setSearchTerm] = useState("");
    const openProjectMenu = useSelector((state) => state.properties.openProjectMenu);

    useEffect(() => {
        console.log(openProjectMenu);
    }, [openProjectMenu]);

    return (
        <div className="">
            <div className={styles.header}>
            <HomeHeader
                setSearchTerm={setSearchTerm} // ✅ truyền hàm toggle
            />
            </div>
            <div className={styles.wrapContent}>
                <div className={`border-r border-gray-border
                    ${openProjectMenu ? 'user-navigation-open' : 'user-navigation-close'}`}
                >
                    <NavigationBar searchTerm={searchTerm} />
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
