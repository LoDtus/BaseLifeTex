// src/pages/Home/Home.jsx
import { useEffect, useState } from "react";
import "./Home.scss";
import { useSearchParams } from "react-router-dom";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import KanbanBoard from "../../components/Kanban/KanbanBoard";
import ListHome from "../../components/List/ListHome";
import { getProjectId } from "../../services/projectService";
import FilterDialog from "../../components/FilterForm/FilterDialog";
import {
  deleteManyTasksRedux,
  getListTaskByProjectIdRedux,
} from "../../redux/taskSlice";
import { useDispatch } from "react-redux";

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const [viewMode, setViewMode] = useState("kanban");
  const [nameProject, setNameProject] = useState("Phần mềm đánh giá"); // Giá trị mặc định
  const [anchorElFilter, setAnchorElFilter] = useState(null);

  useEffect(() => {
    if (idProject) {
      const fetchProjectData = async () => {
        try {
          const response = await getProjectId(idProject);
          if (response.success) {
            setNameProject(response.data.name);
          }
        } catch (error) {
          setNameProject("Phần mềm đánh giá");
          throw error;
        }
      };
      fetchProjectData();
    }
  }, [idProject]);

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

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget); // Mở Popover Filter
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null); // Đóng Popover Filter
  };
const [selectedTasks, setSelectedTasks] = useState([]);
const dispatch = useDispatch();
const handleDeleteSelected = async () => {
  if (selectedTasks.length === 0) {
    alert("Vui lòng chọn ít nhất một task để xóa!");
    return;
  }

  const confirmDelete = window.confirm(
    `Bạn có chắc muốn xóa ${selectedTasks.length} task không?`
  );
  if (!confirmDelete) return;

  try {
    const result = await dispatch(deleteManyTasksRedux(selectedTasks)).unwrap();

    console.log("Kết quả xóa từ Redux:", result); // Debug

    if (result && result.length > 0) {
      alert("✅ Xóa thành công!");
      setSelectedTasks([]); // Reset danh sách chọn
      dispatch(getListTaskByProjectIdRedux(idProject));
    } else {
      alert("Xóa thất bại!");
    }
  } catch (error) {
    alert("Lỗi hệ thống, vui lòng thử lại!");
  }
};
  const openFilter = Boolean(anchorElFilter);
  const filterId = openFilter ? "filter-popover" : undefined;
  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-container">
          <div className="project-info">
            <p className="project-path">Dự án / {nameProject}</p>
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
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
          />
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
            <img
              src="image/Trash.png"
              alt="Delete"
              className="tool-icon"
              onClick={handleDeleteSelected}
            />
            <img
              src="image/Filter.png"
              alt="Filter"
              className="tool-icon"
              onClick={handleClickFilter}
              aria-describedby={filterId}
            />
            <Popover
              id={filterId}
              open={openFilter}
              anchorEl={anchorElFilter}
              onClose={handleCloseFilter}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <FilterDialog idProject={idProject} />
            </Popover>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {viewMode === "kanban" ? (
          <KanbanBoard
            setSelectedTasks={setSelectedTasks}
            selectedTasks={selectedTasks}
          />
        ) : (
          <ListHome
            setSelectedTasks={setSelectedTasks}
            selectedTasks={selectedTasks}
          />
        )}
      </div>
    </div>
  );
}
