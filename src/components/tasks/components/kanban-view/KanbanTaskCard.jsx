import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Popover, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

function KanbanTaskCard({ selectedTasks, setSelectedTasks, task, onMove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      taskId: task.id, // Lưu dữ liệu taskId cho các mục đích cần thiết
    },
  });

  // Cập nhật style với các thuộc tính đúng
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition ? transition : "transform 200ms ease", // Đảm bảo có transition
    opacity: isDragging ? 0.6 : 1, // Giảm opacity khi kéo thả
    cursor: isDragging ? "grabbing" : "grab", // Đổi con trỏ khi kéo thả
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [isKanbaLabel, setIsKanbaLabel] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
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

  const handleDragEnd = (event) => {
    // Cập nhật trạng thái sau khi kéo thả xong
    const newStatus = task.status; // Bạn có thể thay đổi trạng thái này dựa trên logic
    onMove(task.id, newStatus); // Gọi hàm onMove để cập nhật trạng thái
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDragEnd={handleDragEnd}
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
    >
      <div className="task-content">
        <div style={{ display: "flex", width: "100%" }}>
          <p style={{ width: "70%", marginRight: "auto" }}>{task.title}</p>
          <input
            type="checkbox"
            className="checkbox-input"
            checked={selectedTasks.includes(task._id)}
            onChange={(e) => handleSelectTask(e, task._id)}
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
            ? `Kanba ${task.id}`
            : `📅 ${task.endDate || "Chưa giao"}`}
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
  );
}

export default KanbanTaskCard;