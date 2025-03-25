import MainLayout from "../layouts/mainLayout/MainLayout";
import LoginLayout from "../layouts/loginLayout/LoginLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import KabanDetail from "../components/kabanDetail/KabanDetail";
const publicRoutes = [
  {
    path: "/home",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/",
    component: Login,
    layout: LoginLayout,
  },
  {
    path: "/register",
    component: Register,
    layout: LoginLayout,
  },
  {
    path: "/KabanDetail",
    component: KabanDetail,
    layout: LoginLayout,
  },
];

export { publicRoutes };
