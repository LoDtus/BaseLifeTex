import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";
import IssueForm from "../form/IssueForm";
import { useSearchParams } from "react-router-dom";

export default function KanbanColumn({
  columnId,
  column,
  selectedTasks = [],
  setSelectedTasks,
}) {
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
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");

  const sortedTasks = [...column.tasks].sort((a, b) => b.priority - a.priority); // Tạo một bản sao của mảng tasks và sắp xếp theo độ ưu tiên (giảm dần)

  const sortedTasks = [...column.tasks].sort((a, b) => b.priority - a.priority); // Tạo một bản sao của mảng tasks và sắp xếp theo độ ưu tiên (giảm dần)

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column border ${
        isOver ? "kanban-column-over !bg-[#f5f7f9]" : "!bg-[#f5f7f9]"
      }`}
    >
      <h3 className="!m-0">
        {column.title}: {column.tasks.length}
      </h3>
      <button className="add-task" onClick={() => setOpen(true)}>
        ➕ Thêm công việc
      </button>
      <div className="kanban-column-scroll">
        <SortableContext
          id={columnId}
          items={sortedTasks.map((task) => task.id)} // Sử dụng sortedTasks ở đây
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.length === 0 ? ( // Sử dụng sortedTasks ở đây
            <div className="empty-column-placeholder">
              Kéo thả công việc vào đây
            </div>
          ) : (
            sortedTasks.map((task) => (
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
