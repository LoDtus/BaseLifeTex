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
    id: String(columnId), // Đảm bảo ID khớp với handleDragEnd
  });

  if (!column || !column.tasks) {
    return <div>Lỗi: Column không hợp lệ</div>;
  }

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task">➕ Thêm vấn đề</button>
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
            onOpen={onOpen}
          />
        ))}
      </SortableContext>
    </div>
  );
}
