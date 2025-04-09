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

  return (
    <div
      ref={setNodeRef}
      className={`h-full !ml-1  p-2 border border-gray-border rounded-md bg-[#f4f5f7] overflow-y-auto overflow-x-hidden
                ${isOver ? "kanban-column-over" : ""}`}
      style={{
        height: "calc(100vh - 150px)",
        width: "14.2%",
        scrollbarWidth:"none"
      }}
    >
      <h3 className="flex items-center mb-2">
        <span className="font-semibold !text-sm">{column.title}</span>
        <div className="text-[10px] font-semibold py-[2px] bg-[#dbddde] px-1 rounded-full !ml-1">
          <span>{column.tasks.length}</span>
        </div>
      </h3>

      <button
        className="w-full py-1 px-2 bg-white text-dark-gray border border-dashed border-gray-border rounded-md
                    cursor-pointer duration-200 hover:text-black hover:border-black active:scale-90"
        onClick={() => setOpen(true)}
      >
        Thêm công việc
      </button>
      <div>
        <SortableContext
          id={columnId}
          items={sortedTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.length === 0 ? (
            <div
              className="w-full p-2 mt-1 bg-white border !border-dashed border-black rounded-md
                            flex justify-center items-center"
            >
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
