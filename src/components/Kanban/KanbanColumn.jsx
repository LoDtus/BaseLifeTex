import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";
import IssueForm from "../../components/IssueFrom/IssueForm";


function KanbanColumn({ columnId, column }) {
  const { setNodeRef } = useDroppable({ id: columnId });
    const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  }

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task" onClick={handleClick}>➕ Thêm vấn đề</button>
      <SortableContext
        id={columnId}
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
      {
          open && 
      <IssueForm isOpen={open} onClose={() => setOpen(false)} status={column.title}/>
        }
    </div>
  );
}

export default KanbanColumn;