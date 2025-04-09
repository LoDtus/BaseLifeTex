import { useState } from "react";
import HomeHeader from "../../components/common/HomeHeader";
import NavigationBar from "@/components/navigation-bar/NavigationBar";
import styles from "../styles/MainLayout.module.scss";
import { useSelector } from "react-redux";
import '@/components/navigation-bar/styles/navigation.css';
import TaskForm from '@/components/tasks/components/form/TaskForm';
import TaskDetails from '@/components/tasks/components/form/TaskDetails';

export default function HomeLayout({ children }) {
    const [searchTerm, setSearchTerm] = useState("");
    const openProjectMenu = useSelector((state) => state.properties.openProjectMenu);
    const taskState = useSelector((state) => state.properties.taskState);

    return (
        <div className="">
            <div className={styles.header}>
            <HomeHeader
                setSearchTerm={setSearchTerm}
            />
            </div>
            <div className={styles.wrapContent}>
                <div className={`border-r border-gray-border max-w-[300px]
                    ${openProjectMenu ? 'user-navigation-open' : 'user-navigation-close'}`}
                >
                    <NavigationBar searchTerm={searchTerm} />
                </div>
                <div className={styles.content}>{children}</div>
            </div>
            { (taskState.slice(0, 7).includes('ADD') || taskState.slice(0, 7).includes('UPDATE')) && <TaskForm/> }
            { (taskState.slice(0, 7).includes('DETAILS') || taskState.slice(0, 7).includes('PREVIEW')) && <TaskDetails/> }
        </div>
    );
}
