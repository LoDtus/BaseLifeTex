import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../DraggableTask/TaskCard";

export default function Column({
  columnId,
  column,
  checkedTasks,
  handleCheckboxChange,
  onOpen,
}) {
  const { setNodeRef } = useDroppable({
    id: String(columnId),
  });

  if (!column || !column.tasks) {
    return <div>Lỗi: Column không hợp lệ</div>;
  }

  const handleAddIssue = () => {
    onOpen(column.title); // Truyền title của cột khi nhấn nút
  };

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button onClick={handleAddIssue} className="add-task">
        ➕ Thêm vấn đề
      </button>
      <SortableContext
        id={String(columnId)}
        items={column.tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            checkedTasks={checkedTasks}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </SortableContext>
    </div>
  );
}