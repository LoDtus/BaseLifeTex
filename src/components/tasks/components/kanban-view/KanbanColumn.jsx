import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";
import IssueForm from "@/components/tasks/components/form/IssueForm";

export default function KanbanColumn({ columnId, column, selectedTasks = [], setSelectedTasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const [open, setOpen] = useState(false);

  const statusMapReverse = {
    PREPARE: 1,
    IN_PROGRESS: 2,
    TEST: 3,
    FINISH: 4,
    CLOSE: 5,
    PAUSE: 6,
    NOT_DO: 7,
  };

  const statusValue = statusMapReverse[columnId];

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "kanban-column-over" : ""}`}
    >
      <h3>
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task" onClick={() => setOpen(true)}>
        ➕ Thêm vấn đề
      </button>
      <div className="kanban-column-scroll">
        <SortableContext
          id={columnId}
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <div className="empty-column-placeholder">
              Kéo thả công việc vào đây
            </div>
          ) : (
            column.tasks.map((task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
              />
            ))
          )}
        </SortableContext>
      </div>
      {open && (
        <IssueForm
          isOpen={open}
          onClose={() => setOpen(false)}
          status={statusValue}
        />
      )}
    </div>
  );
}