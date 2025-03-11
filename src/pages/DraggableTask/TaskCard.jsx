import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  task,
  checkedTasks = {},
  handleCheckboxChange,
  onOpen,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(task?.id || ""),
  });

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
        <p>
          {task.title} <span onClick={onOpen}>✏️</span>
        </p>
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
