import { useState } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "../DraggableTask/Column";
import IssueForm from "../../components/IssueFrom/IssueForm";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import FilterDialog from "../../components/FilterForm/FilterDialog";

// Dữ liệu ban đầu
const initialColumns = [
  {
    id: 1,
    title: "Công việc mới",
    tasks: [
      { id: 1, title: "fix header", project: "Kan-1", assignee: "TuanPM" },
      { id: 2, title: "fix header", project: "Kan-2", assignee: "TuanPM" },
      { id: 3, title: "fix header", project: "Kan-3", assignee: "TuanPM" },
      { id: 4, title: "fix header", project: "Kan-3", assignee: "TuanPM" },
    ],
  },
  {
    id: 2,
    title: "Đang thực hiện",
    tasks: [
      { id: 4, title: "fix sidebar", project: "Kan-1", assignee: "HuyNQ" },
    ],
  },
  {
    id: 3,
    title: "Hoàn thành",
    tasks: [
      { id: 5, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 6, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 7, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 8, title: "test", project: "Kan-1", assignee: "HuyNQ" },
    ],
  },
  {
    id: 4,
    title: "Kết thúc",
    tasks: [{ id: 9, title: "test", project: "Kan-1", assignee: "HuyNQ" }],
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [anchorElMember, setAnchorElMember] = useState(null); // Anchor cho Member Popover
  const [anchorElFilter, setAnchorElFilter] = useState(null); // Anchor cho Filter Popover
  const [issueStatus, setIssueStatus] = useState(""); // Trạng thái của cột

  const handleClickMember = (event) => {
    setAnchorElMember(event.currentTarget); // Mở Popover danh sách nhân viên
  };

  const handleCloseMember = () => {
    setAnchorElMember(null); // Đóng Popover danh sách nhân viên
  };

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget); // Mở Popover lọc công việc
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null); // Đóng Popover lọc công việc
  };

  const onClose = () => {
    setOpen(false);
    setIssueStatus(""); // Reset trạng thái khi đóng form
  };

  const openModal = (status) => {
    setIssueStatus(status); // Lưu trạng thái của cột
    setOpen(true);
  };

  const [anchorElFilter, setAnchorElFilter] = useState(null);

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null);
  };

  const openFiter = Boolean(anchorElFilter);
  const id = openFiter ? "simple-popover" : undefined;

  const navigate = useNavigate();

  const [columns, setColumns] = useState(initialColumns);
  const [checkedTasks, setCheckedTasks] = useState({});

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    console.log("Dragged Task ID:", activeId);
    console.log("Over ID:", overId);

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => String(task.id) === String(activeId))
    );
    if (!activeColumn) {
      console.error("Không tìm thấy cột nguồn!");
      return;
    }

    const activeTask = activeColumn.tasks.find(
      (task) => String(task.id) === String(activeId)
    );
    if (!activeTask) {
      console.error("Không tìm thấy task được kéo!");
      return;
    }

    let overColumn = columns.find((col) => String(col.id) === String(overId));
    let isOverTask = false;

    if (!overColumn) {
      overColumn = columns.find((col) =>
        col.tasks.some((task) => String(task.id) === String(overId))
      );
      isOverTask = true;
    }

    if (!overColumn) {
      console.error("Không tìm thấy cột đích!");
      return;
    }

    if (activeColumn.id === overColumn.id) {
      if (isOverTask) {
        const oldIndex = activeColumn.tasks.findIndex(
          (task) => String(task.id) === String(activeId)
        );
        const newIndex = activeColumn.tasks.findIndex(
          (task) => String(task.id) === String(overId)
        );
        if (oldIndex !== newIndex) {
          const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
          setColumns(
            columns.map((col) =>
              col.id === activeColumn.id ? { ...col, tasks: newTasks } : col
            )
          );
          console.log("Đã sắp xếp lại trong cùng cột:", newTasks);
        }
      }
      return;
    }

    const newActiveTasks = activeColumn.tasks.filter(
      (task) => String(task.id) !== String(activeId)
    );
    let newOverTasks = [...overColumn.tasks];

    if (isOverTask) {
      const overTaskIndex = overColumn.tasks.findIndex(
        (task) => String(task.id) === String(overId)
      );
      newOverTasks.splice(overTaskIndex, 0, activeTask);
    } else {
      newOverTasks.push(activeTask);
    }

    setColumns(
      columns.map((col) =>
        col.id === activeColumn.id
          ? { ...col, tasks: newActiveTasks }
          : col.id === overColumn.id
          ? { ...col, tasks: newOverTasks }
          : col
      )
    );
    console.log("Đã chuyển task sang cột khác:", {
      newActiveTasks,
      newOverTasks,
    });
  };

  const handleCheckboxChange = (taskId) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const addNewColumn = () => {
    const newColumn = {
      id: columns.length + 1,
      title: "Cột mới",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <p className="text-gray-500 text-sm">Dự án / Phần mềm đánh giá</p>
          <div className="flex items-center gap-2">
            <img src="image/Column.png" alt="LIFETEK" className="logo-img" />
            <img
              onClick={() => navigate("/ListHome")}
              src="image/List.png"
              alt="LIFETEK"
              className="logo-img"
            />
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
                  onClick={handleClickMember} // Gắn sự kiện mở danh sách nhân viên
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-8 h-8 rounded-full border border-white shadow"
                />
              ))}
            </div>
          </div>

          {/* Popover cho danh sách nhân viên */}
          <Popover
            open={Boolean(anchorElMember)}
            anchorEl={anchorElMember}
            onClose={handleCloseMember}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{ mt: 1 }}
          >
            <MemberListContent onClose={handleCloseMember} />
          </Popover>

          <div className="task-header">
            <div className="task-icons">
              <img src="image/Trash.png" alt="List" />
              <img
                src="image/Filter.png"
                alt="Columns"
                onClick={handleClickFilter}
              />
              <Popover
                id={id}
                open={openFiter}
                anchorEl={anchorElFilter}
                onClose={handleCloseFilter}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <FilterDialog />
              </Popover>
            </div>
            {/* Popover cho lọc công việc */}
            <Popover
              open={Boolean(anchorElFilter)}
              anchorEl={anchorElFilter}
              onClose={handleCloseFilter}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ mt: 1 }}
            >
              <FilterDialog />
            </Popover>
          </div>
        </div>
      </div>

      {/* Bọc bảng Kanban trong một container cuộn ngang */}
      <div className="kanban-wrapper">
        {/* Bảng Kanban */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-container">
            {columns.map((column) => (
              <Column
                key={column.id}
                columnId={column.id}
                column={column}
                checkedTasks={checkedTasks}
                handleCheckboxChange={handleCheckboxChange}
                onOpen={openModal} // Truyền hàm openModal
              />
            ))}
          </div>
        </DndContext>
      </div>
      {open && (
        <IssueForm isOpen={open} onClose={onClose} status={issueStatus} />
      )}
    </div>
  );
}
