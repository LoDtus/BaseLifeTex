import { useSelector } from "react-redux";
import "./Header.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
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
                top: "8px",
              }}
            />
          </div>
          <NotificationPopup />
          <span className="user-name">
            {user ? user.data?.user.userName : "Khách"}
          </span>
          <img
            src="public/image/image_4.png"
            alt="avatar"
            className="user-icon"
          />
        </div>
      </header>
    </div>
  );
}
