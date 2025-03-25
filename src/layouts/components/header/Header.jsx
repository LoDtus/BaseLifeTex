import { useSelector, useDispatch } from "react-redux";
import "./Header.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationPopup from "../../../components/notificationPopup/NotificationPopup";
import { logoutUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const userName = user?.data?.user?.userName || "Khách";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = user?.data?.accessToken;
    if (!accessToken) {
      console.error("Không tìm thấy accessToken trong Redux store", user);
      alert("Vui lòng đăng nhập lại!");
      navigate("/");
      return;
    }

    try {
      await logoutUser(dispatch, navigate, accessToken);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div>
      <header className="kanban-header">
        <div className="logo">
          <img src="/image/image.png" alt="LIFETEK" className="logo-img" />
          <span className="logo-text">LIFETEK</span>
        </div>

        <div className="user-profile">
          <div className="search-bar" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="search-input"
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
            <img src="/image/image_4.png" alt="avatar" className="user-icon" />
            <div className="logout-container" onClick={handleLogout}>
              <LogoutIcon sx={{ cursor: "pointer", fontSize: "18px" }} />
              <span className="logout-text">Đăng xuất</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
