import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Popover, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import KanbanCards from "../../styles/KanbanCard.module.scss";
import TaskDetailView from "../task-details/TaskDetailView";
import ListIcon from "@mui/icons-material/List";

export default function KanbanTaskCard({ selectedTasks, setSelectedTasks, task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease, opacity 0.2s ease", // Thêm transition cho transform và opacity
    opacity: isDragging ? 0.6 : 1,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [isKanbaLabel, setIsKanbaLabel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (event) => {
    // event.preventDefault();
    event.stopPropagation();
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };
  const handleLabelClick = (event) => {
    event.stopPropagation();
    setIsKanbaLabel((prev) => !prev);
  };
  const open = Boolean(anchorEl);
  const primaryUserName =
    task.assigneeUserNames && task.assigneeUserNames.length > 0
      ? task.assigneeUserNames[0]
      : "Chưa giao";
  const remainingUserNames =
    task.assigneeUserNames && task.assigneeUserNames.length > 1
      ? task.assigneeUserNames.slice(1)
      : [];
  const handleSelectTask = (event, taskId) => {
    event.stopPropagation();
    const updatedSelection = selectedTasks.includes(taskId)
      ? selectedTasks.filter((id) => id !== taskId)
      : [...selectedTasks, taskId];
    setSelectedTasks(updatedSelection);
  };
  const handleButtonClick = React.useCallback((event) => {
    event.stopPropagation();
    setIsModalOpen((prev) => !prev);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal khi cần
  };
  const handlePointerDown = (event) => {
    event.stopPropagation();
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`kanban-card ${isDragging ? "dragging" : ""}`}
      >
        <div className="task-content">
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <Tooltip
              title={task.title}
              placement="top"
              arrow
              classes={{ tooltip: "custom-tooltip" }}
            >
              <p
                className="truncate"
                style={{ width: "70%", marginRight: "auto" }}
              >
                {task.title}
              </p>
            </Tooltip>
            <button
              onPointerDown={handlePointerDown}
              onClick={handleButtonClick}
              className={KanbanCards.buttonIcon}
            >
              <ListIcon className={KanbanCards.listIcon} />
            </button>
            <input
              type="checkbox"
              className={KanbanCards.checkbox}
              checked={selectedTasks.includes(task._id)}
              onChange={(e) => {
                handleSelectTask(e, task._id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="card-footer">
          <span
            className="project-label"
            onClick={handleLabelClick}
            style={{ cursor: "pointer" }}
          >
            {isKanbaLabel
              ? `Kanban ${task.id}`
              : `📅 ${dayjs(task.endDate).format("DD/MM/YYYY") || "Chưa giao"}`}
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong>{primaryUserName}</strong>
            {remainingUserNames.length > 0 && (
              <div
                className="assignee-toggle"
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  onClick={handleClick}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{ fontSize: "12px" }}
                >
                  ▼
                </span>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  sx={{ mt: 1 }}
                >
                  <div
                    style={{
                      padding: "20px",
                      maxWidth: "250px",
                      position: "relative",
                    }}
                  >
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      onPointerDown={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "5px",
                      }}
                    >
                      <CloseIcon style={{ fontSize: "18px" }} />
                    </IconButton>
                    <div style={{ marginRight: "40px" }}>
                      <strong
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontSize: "14px",
                        }}
                      >
                        Danh sách người tham gia:
                      </strong>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "20px",
                          listStyleType: "disc",
                        }}
                      >
                        {remainingUserNames.map((userName, index) => (
                          <li
                            key={index}
                            style={{
                              marginBottom: "8px",
                              lineHeight: "1.5",
                              fontSize: "14px",
                            }}
                          >
                            {userName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TaskDetailView
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          task={task}
        />
      )}
    </>
  );
};