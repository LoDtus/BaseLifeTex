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
  };

  // Ánh xạ trạng thái từ key của cột sang giá trị số để gửi lên server
  const statusMapReverse = {
    PREPARE: 1,
    IN_PROGRESS: 2,
    FINISH: 4,
    NOT_DO: 7,
  };

  const statusValue = statusMapReverse[columnId];

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task" onClick={handleClick}>➕ Thêm vấn đề</button>
      <div className="kanban-column-scroll">
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
      {open && (
        <IssueForm
          isOpen={open}
          onClose={() => setOpen(false)}
          status={statusValue} // Truyền giá trị số (1, 2, 4, 7) thay vì tiêu đề
        />
      )}
    </div>
  );
}

export default KanbanColumn;