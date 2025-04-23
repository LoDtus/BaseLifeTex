import { useSelector, useDispatch } from "react-redux";
import "./styles/Header.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationPopup from "./NotificationPopup";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";

export default function HomeHeader({ setSearchTerm }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const avatar =
    user?.data?.user?.avatar ||
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Đảo ngược trạng thái modal
  };

  return (
    <Container fluid className="p-0 m-0">
      <header className="kanban-header d-flex justify-content-between align-items-center py-2 px-3 border-bottom">
        <div className="logo d-flex align-items-center">
          <img
            src="/icons/lifetex.png"
            alt="LIFETEK"
            className="logo-img me-2"
          />
          <span className="logo-text fw-bold">LIFETEK</span>
        </div>

        <div className="user-profile d-flex align-items-center">
          <InputGroup className="me-3" style={{ width: 210 }}>
            <InputGroup.Text>
              <SearchIcon sx={{ fontSize: 20 }} />
            </InputGroup.Text>
            <Form.Control
              className="   border-[0.5px] 
  
    focus:outline-none 
    text-sm 
    rounded-sm 
   px-1.5 py-[4px]
   "
              placeholder="Tìm kiếm dự án..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </InputGroup>

          <NotificationPopup />

          <span className="user-name fw-medium me-2">{userName}</span>

          <div className="avatar-container position-relative d-flex align-items-center">
            <img
              src={avatar}
              alt="avatar"
              className="user-icon me-2"
              onClick={toggleModal}
              style={{
                cursor: "pointer",
                width: 35,
                height: 35,
                borderRadius: "50%",
              }}
            />
            <div
              className="logout-container d-flex align-items-center"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
              <span className="logout-text ms-1">Đăng xuất</span>
            </div>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <UserModal user={user?.data?.user} onClose={toggleModal} />
      )}
    </Container>
  );
}
