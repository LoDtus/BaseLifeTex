import { useSelector, useDispatch } from "react-redux";
import "./styles/Header.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationPopup from "./NotificationPopup";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function HomeHeader({ setSearchTerm }) {

  const user = useSelector((state) => state.auth.login.currentUser);
  const avatar = user?.data?.user?.avatar || "/imgs/basic-user.png";
  const userName = user?.data?.user?.userName || "Khách";
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = user?.data?.accessToken;
        if (!accessToken) {
            toast.error("Vui lòng đăng nhập lại!");
            navigate("/");
            return;
        }
        await logoutUser(dispatch, navigate, accessToken);
    };

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(searchText); // Cập nhật giá trị tìm kiếm lên MainLayout
        }, 300);
        return () => clearTimeout(handler);
    }, [searchText]);

    return (
        <div>
            <header className="kanban-header">
                <div className="logo">
                    <img src="/icons/lifetex.png" alt="LIFETEK" className="logo-img" />
                    <span className="logo-text">LIFETEK</span>
                </div>
                <div className="user-profile">
                    <div className="search-bar" style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm dự án..."
                            className="search-input"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value.trim())}
                        />
                        <SearchIcon
                            sx={{
                                fontSize: "20px",
                                position: "absolute",
                                left: "6px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        />
                    </div>
                    <NotificationPopup />
                    <span className="user-name">{userName}</span>
                    <div className="avatar-container">
                        <img src={avatar} alt="avatar" className="user-icon" />
                        <div className="logout-container" onClick={handleLogout}>
                            <LogoutIcon sx={{ cursor: "pointer", fontSize: "18px" }} />
                            <span className="logout-text">Đăng xuất</span>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};