import { useDraggable } from "@dnd-kit/core";
import { Popover } from "@mui/material";
import React, { useState } from "react";

function KanbanTaskCard({ task, index, totalTasks }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [isKanbaLabel, setIsKanbaLabel] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation(); // Ngăn sự kiện kéo thả can thiệp
    setAnchorEl((prev) => (prev ? null : event.currentTarget)); // Toggle trạng thái
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLabelClick = (event) => {
    event.stopPropagation(); // Ngăn sự kiện kéo thả can thiệp
    setIsKanbaLabel((prev) => !prev); // Toggle giữa Kanba label và ngày
  };

  const open = Boolean(anchorEl);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  // Lấy userName đầu tiên để hiển thị
  const primaryUserName = task.assigneeUserNames && task.assigneeUserNames.length > 0 ? task.assigneeUserNames[0] : "Chưa giao";
  const remainingUserNames = task.assigneeUserNames && task.assigneeUserNames.length > 1 ? task.assigneeUserNames.slice(1) : [];

  // Tính số thứ tự cho "Kanba"
  const kanbaNumber = index + 1; // Số thứ tự bắt đầu từ 1

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="kanban-card"
    >
      <div className="task-content">
        <div>
          <p>{task.title}</p>
        </div>
      </div>
      <div className="card-footer">
        <span
          className="project-label"
          onClick={handleLabelClick}
          style={{ cursor: "pointer" }}
        >
          {isKanbaLabel ? `Kanba ${kanbaNumber}` : `📅 ${task.endDate || "Chưa giao"}`}
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <strong>{primaryUserName}</strong>
          {remainingUserNames.length > 0 && (
            <div
              style={{ cursor: "pointer", marginLeft: "5px", display: "flex", alignItems: "center" }}
            >
              <span
                onClick={handleClick}
                onPointerDown={(e) => e.stopPropagation()} // Ngăn sự kiện kéo thả can thiệp ngay từ đầu
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
                <div style={{ padding: "10px", maxWidth: "200px" }}>
                  <strong>Danh sách người tham gia:</strong>
                  <ul style={{ margin: "5px 0 0 0", paddingLeft: "15px" }}>
                    {remainingUserNames.map((userName, index) => (
                      <li key={index}>{userName}</li>
                    ))}
                  </ul>
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