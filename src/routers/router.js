import MainLayout from "../layouts/components/HomeLayout";
import AccessLayout from "../layouts/components/AccessLayout";
import Home from "@/pages/Home/Home";
import Login from "../pages/sign-in/SignIn";
import Register from "../pages/sign-up/SignUp";
import TaskDetailView from "@/components/tasks/components/task-details/TaskDetailView";
import VerifyEmail from "@/components/access/components/VerifyEmail";

const publicRoutes = [
    {
        path: "/",
        component: Login,
        layout: AccessLayout,
    },
    {
        path: "/register",
        component: Register,
        layout: AccessLayout,
    },
    {
        path: "/verify-email",
        component: VerifyEmail,
        layout: AccessLayout,
    },
    {
        path: "/kanban-detail",
        component: TaskDetailView,
        layout: AccessLayout,
    },
    {
        path: "/home",
        component: Home,
        layout: MainLayout,
    },
];

export default publicRoutes;