import { useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";
import IssueForm from "../../components/IssueForm/IssueForm";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function KanbanColumn({
  columnId,
  column,
  selectedTasks = [],
  setSelectedTasks,
  searchTerm,
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
  const listTask = useSelector((state) => state.task.listTask);

  const filteredTasks = useMemo(() => {
    return listTask
      .filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((task) => task.status === statusValue)
      .sort((a, b) => a.order - b.order);
  }, [listTask, searchTerm, statusValue]);

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "kanban-column-over" : ""}`}
    >
      <h3>
        {column.title}: {filteredTasks.length}
      </h3>
      <button className="add-task" onClick={() => setOpen(true)}>
        ➕ Thêm vấn đề
      </button>
      <div className="kanban-column-scroll">
        <SortableContext
          id={columnId}
          items={filteredTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.length === 0 ? (
            <div className="empty-column-placeholder">
              Kéo thả công việc vào đây
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <KanbanTaskCard
                key={task.id ? `${task.id}-${columnId}` : `fallback-${index}-${columnId}`}
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
