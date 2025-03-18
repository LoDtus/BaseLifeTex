import { useDraggable } from "@dnd-kit/core";
import React from "react";

function KanbanTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

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
        <span className="project-label">📅 {task.project || "Không xác định"}</span>
        <strong>
          {task.assigneeId.length > 0
            ? task.assigneeId.map((a) => a.name || a.id).join(", ")
            : "Chưa giao"}
        </strong>
      </div>
    </div>
  );
}

export default KanbanTaskCard;