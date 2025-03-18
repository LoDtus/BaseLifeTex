import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";

function KanbanColumn({ columnId, column }) {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task">➕ Thêm vấn đề</button>
      <SortableContext
        id={columnId}
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

export default KanbanColumn;