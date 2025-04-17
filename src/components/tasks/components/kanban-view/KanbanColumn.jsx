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
import { setTaskForm } from "@/redux/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";

export default function KanbanColumn({
  columnId,
  column,
  selectedTasks = [],
  setSelectedTasks,
}) {
  const dispatch = useDispatch();
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
  const user = useSelector((state) => state.auth.login.currentUser.data.user);

  const sortedTasks = [...column.tasks].sort((a, b) => b.priority - a.priority); // Tạo một bản sao của mảng tasks và sắp xếp theo độ ưu tiên (giảm dần)

  return (
    <div
      className={`h-full !ml-1 pd-2-custom border border-gray-border rounded-md bg-[#f4f5f7] overflow-y-auto overflow-x-hidden
                ${isOver ? "kanban-column-over" : ""}`}
      style={{
        height: "calc(100vh - 150px)",
        width: "14.2%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        position: "relative",
      }}
    >
      <div className="fixed z-10 bg-[#f4f5f7] custom-fixed">
        <h3 className="flex items-center mb-2 mt-2">
          <span className="font-semibold !text-sm">{column.title}</span>
          <div className="text-[10px] font-semibold py-[2px] bg-[#dbddde] px-1 rounded-full !ml-1">
            <span>{column.tasks.length === 0 ? "" : column.tasks.length}</span>
          </div>
        </h3>
        {user.role === 0 && (
          <button
            className="w-full py-1 px-2 bg-white text-dark-gray border border-dashed border-gray-border rounded-md
                    cursor-pointer duration-200 hover:text-black hover:border-black active:scale-90 mb-2"
            onClick={() => dispatch(setTaskForm("ADD"))}
          >
            Thêm công việc
          </button>
        )}
      </div>
      <div ref={setNodeRef} className="items-custom">
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
