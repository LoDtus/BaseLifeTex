// src/pages/Home/Home.jsx
import { useState } from "react";
import "./Home.scss";
import { useSearchParams } from "react-router-dom";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import KanbanBoard from "../../components/Kanban/KanbanBoard";
import ListHome from "../../components/List/ListHome";

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const [viewMode, setViewMode] = useState("kanban");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchToKanban = () => {
    setViewMode("kanban");
  };

  const handleSwitchToList = () => {
    setViewMode("list");
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-container">
          <div className="project-info">
            <p className="project-path">Dự án / Phần mềm đánh giá</p>
          </div>
          <div className="view-toggle">
            <img
              src="image/Column.png"
              alt="Kanban View"
              className={`view-icon ${viewMode === "kanban" ? "active" : ""}`}
              onClick={handleSwitchToKanban}
            />
            <img
              src="image/List.png"
              alt="List View"
              className={`view-icon ${viewMode === "list" ? "active" : ""}`}
              onClick={handleSwitchToList}
            />
          </div>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="toolbar-section">
        <div className="search-container">
          <svg
            className="search-icon"
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
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
          <div className="avatar-group">
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
                className="avatar"
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
            <img src="image/Trash.png" alt="Delete" className="tool-icon" />
            <img src="image/Filter.png" alt="Filter" className="tool-icon" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {viewMode === "kanban" ? <KanbanBoard /> : <ListHome />}
      </div>
    </div>
  );
}