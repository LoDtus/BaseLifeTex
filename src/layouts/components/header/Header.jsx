import { useSelector } from "react-redux";
import "./Header.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationPopup from "../../../components/notificationPopup/NotificationPopup";

export default function Header() {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <div>
      <header className="kanban-header">
        <div className="logo">
          <img src="image/image.png" alt="LIFETEK" className="logo-img" />
          <span className="logo-text">LIFETEX</span>
        </div>

        <div className="user-profile">
          <div className="search-bar">
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
                top: "9px",
              }}
            />
          </div>
          <NotificationPopup />
          <span className="user-name">
            {user ? user.data?.user.userName : "Khách"}
          </span>
          <div className="avatar-container">
            <img
              src="public/image/image_4.png"
              alt="avatar"
              className="user-icon"
            />
            <div className="logout-container">
              <LogoutIcon sx={{ cursor: "pointer", fontSize: "18px" }} />
              <span className="logout-text">Đăng xuất</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
