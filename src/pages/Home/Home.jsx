import { useState, useEffect } from "react";
import "./Home.scss";
import { Link, useNavigate } from "react-router-dom";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import KanbanBoard from "../../components/Kanban/KanbanBoard";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <div>
            <p
              style={{ fontSize: "13px", color: "#485F7E", fontWeight: "600" }}
              className="text-sm"
            >
              Dự án / Phần mềm đánh giá
            </p>
            <p
              style={{
                color: "#000",
                fontWeight: "600",
                fontSize: "20px",
                marginTop: "4px",
              }}
            >
              KAN board
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img src="image/Column.png" alt="LIFETEK" className="logo-img" />
            <Link to={`/ListHome?idProject=${idProject}`}>
              <img src="image/List.png" alt="LIFETEK" className="logo-img" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tìm kiếm & Avatars */}
      <div className="flex items-center gap-4">
        {/* Ô tìm kiếm */}
        <div className="search-container relative flex items-center">
          <svg
            className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m2.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 border rounded-md w-64"
          />

          {/* Danh sách avatar */}
          {/* Danh sách avatar với hình ảnh */}
          <div className="flex -space-x-2 overflow-hidden">
            {[
              "image/image_4.png",
              "image/image_5.png",
              "image/image_6.png",
              "image/image_7.png",
              "image/image_8.png",
              "image/dot.png",
            ].map((avatar, index) => (
              <img
                onClick={handleClick}
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="w-8 h-8 rounded-full border border-white shadow"
              />
            ))}
          </div>
        </div>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ mt: 1 }}
        >
          <MemberListContent onClose={handleClose} />
        </Popover>

        <div className="task-header">
          <div className="task-icons">
            <img src="image/Trash.png" alt="List" />
            <img src="image/Filter.png" alt="Columns" />
          </div>
        </div>
      </div>

        {/* Bảng Kanban */}
        <KanbanBoard />
       
    </div>
  );
}