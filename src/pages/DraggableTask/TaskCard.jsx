import { useDraggable } from "@dnd-kit/core";
import { Input } from "@mui/material";
import React, { useRef, useState } from "react";

export default function TaskCard({
  task,
  checkedTasks = {},
  handleCheckboxChange,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(task?.id || ""),
  });

  const [title, setTitle] = useState(task.title || "");

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0); // Tự động focus vào input
  };

  // Khi người dùng nhấn Enter hoặc click ra ngoài thì lưu giá trị mới
  const handleBlurOrEnter = (event) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    setIsEditing(false);
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (!task) {
    return <div>Lỗi: Task không hợp lệ</div>;
  }

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
          {isEditing ? (
            <Input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlurOrEnter}
              onKeyDown={handleBlurOrEnter}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <p>
              {title}
              <span
                style={{ cursor: "pointer" }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={handleEditClick} // Dùng onMouseDown thay vì onClick
              >
                ✏️
              </span>
            </p>
          )}
        </div>

        <input
          type="checkbox"
          checked={checkedTasks[task.id] || false}
          onChange={() => handleCheckboxChange(task.id)}
        />
      </div>
      <div className="card-footer">
        <span className="project-label">📅 {task.project}</span>
        <strong>{task.assignee}</strong>
      </div>
    </div>
  );
}
