import { useDraggable } from "@dnd-kit/core";
import { Popover, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";

function KanbanTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [isKanbaLabel, setIsKanbaLabel] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCustom, setIsDraggingCustom] = useState(false);

  const handleClick = (event) => {
    event.preventDefault(); // Ngăn hành vi mặc định
    event.stopPropagation(); // Ngăn lan tỏa đến kéo thả
    console.log("Arrow clicked"); // Debug
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
    console.log("Popover closed via close button");
  };

  const handleLabelClick = (event) => {
    event.stopPropagation();
    setIsKanbaLabel((prev) => !prev);
  };

  const handleDragStart = (event) => {
    // Chỉ kích hoạt phần tử ảo nếu không click vào mũi tên
    if (!event.target.closest(".assignee-toggle")) {
      setIsDraggingCustom(true);
      const rect = event.target.getBoundingClientRect();
      setDragPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDraggingCustom) {
        setDragPosition({
          x: event.clientX - 50,
          y: event.clientY - 20,
        });
      }
    };

    if (isDraggingCustom) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDraggingCustom]);

  const handleDragEnd = () => {
    setIsDraggingCustom(false);
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

  return (
    <>
      <div
        ref={setNodeRef}
        className={`kanban-card ${isDragging ? "dragging" : ""}`}
        {...listeners} // Áp dụng kéo thả lên toàn bộ card
        {...attributes}
        onMouseDown={handleDragStart} // Kích hoạt phần tử ảo
        onMouseUp={handleDragEnd} // Kết thúc phần tử ảo
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
                  onMouseDown={(e) => e.stopPropagation()} // Ngăn kéo thả khi click mũi tên
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

      {/* Phần tử ảo mô phỏng DragOverlay */}
      {isDraggingCustom && (
        <div
          className="kanban-card dragging-custom"
          style={{
            position: "fixed",
            top: dragPosition.y,
            left: dragPosition.x,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div className="task-content">
            <div>
              <p>{task.title}</p>
            </div>
          </div>
          <div className="card-footer">
            <span className="project-label">
              {isKanbaLabel
                ? `Kanba ${task.id}`
                : `📅 ${task.endDate || "Chưa giao"}`}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <strong>{primaryUserName}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KanbanTaskCard;