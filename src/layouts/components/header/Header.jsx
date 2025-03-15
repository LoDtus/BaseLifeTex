import { useSelector } from "react-redux";
import "./Header.scss";

export default function Header() {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <div>
      <header className="kanban-header">
        <div className="logo">
          <img src="image/image.png" alt="LIFETEK" className="logo-img" />
          <span className="logo-text">LIFETEX</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm dự án..."
            className="search-input"
          />
        </div>
        <div className="user-profile">
          <span className="user-icon">🧑‍💻</span>
          <span className="user-name">
            {user ? user.data.userName : "Khách"}
          </span>
        </div>
      </header>
    </div>
  );
}
