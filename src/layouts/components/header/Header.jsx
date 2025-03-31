import { useSelector, useDispatch } from "react-redux";
import "./Header.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationPopup from "../../../components/notificationPopup/NotificationPopup";
import { logoutUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProjects } from "../../../redux/projectSlice"
import Navbar from "../navbar/Navbar";

export default function Header({ setSearchTerm }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const userName = user?.data?.user?.userName || "Khách";
  const avatar = user?.data?.user?.avatar;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject") || "";
  const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const handleLogout = async () => {
    const accessToken = user?.data?.accessToken;
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập lại!");
      navigate("/");
      return;
    }
    await logoutUser(dispatch, navigate, accessToken);
  };
  
    useEffect(() => {
      if (!idProject) return;
      dispatch(
        searchProjects({
          searchQuery: debouncedKeyword,
          idProject: idProject,
        })
      );
    }, [debouncedKeyword, idProject, dispatch]);

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
          <img src="/image/image.png" alt="LIFETEK" className="logo-img" />
          <span className="logo-text">LIFETEK</span>
        </div>
        <div className="user-profile">
          <div className="search-bar" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
}
