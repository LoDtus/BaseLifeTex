import {
  closestCorners,
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  DragOverlay,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { updateTaskStatus } from "@/services/taskService";
import { useSearchParams } from "react-router-dom";
import { getListTaskByProjectId } from "@/redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function createEmptyColumns(statuses) {
  const columns = {};
  statuses.forEach((status) => {
    columns[status.label] = {
      title: status.label,
      tasks: [],
    };
  });
  return columns;
}

function transformTasksData(tasks, statuses) {
  const acc = createEmptyColumns(statuses);
  tasks.forEach((task) => {
    const statusLabel = task.statusLabel || "Công việc mới";
    if (!acc[statusLabel]) {
      acc[statusLabel] = { title: statusLabel, tasks: [] };
    }

    acc[statusLabel].tasks.push({
      ...task,
      id: task._id,
      userName:
        Array.isArray(task.assigneeId) &&
        task.assigneeId.length > 0 &&
        task.assigneeId[0]?.userName
          ? task.assigneeId[0].userName
          : "Chưa giao",
      assigneeUserNames: Array.isArray(task.assigneeId)
        ? task.assigneeId
            .filter((a) => a && typeof a.userName === "string")
            .map((a) => a.userName)
        : [],
      assigneeId: Array.isArray(task.assigneeId)
        ? task.assigneeId
            .filter((a) => a && a._id)
            .map((a) => ({ ...a, id: a._id }))
        : [],
    });
  });
  return acc;
}

function KanbanBoard({ selectedTasks, setSelectedTasks }) {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const statuses = useSelector((state) => state.status.statuses);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (
      Array.isArray(listTask) &&
      Array.isArray(statuses) &&
      statuses.length > 0
    ) {
      const formattedData = transformTasksData(listTask, statuses);
      setColumns(formattedData);
    }
  }, [listTask, statuses]);

  useEffect(() => {
    if (idProject) {
      dispatch(
        getListTaskByProjectId({ projectId: idProject, page: 1, limit: 100 })
      );
    }
  }, [idProject, dispatch]);

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    if (!sourceKey) return;

    const destKey = columns[over.id]
      ? over.id
      : Object.keys(columns).find((key) =>
          columns[key].tasks.some((task) => task.id === over.id)
        );
    if (!destKey || sourceKey === destKey) return;

    const sourceColumn = columns[sourceKey];
    const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === active.id);
    const newIndex = columns[destKey].tasks.findIndex((t) => t.id === over.id);

    const updatedSourceTasks = [...sourceColumn.tasks];
    const [movedTask] = updatedSourceTasks.splice(oldIndex, 1);

    setColumns((prev) => ({
      ...prev,
      [sourceKey]: { ...prev[sourceKey], tasks: updatedSourceTasks },
      [destKey]: {
        ...prev[destKey],
        tasks: [
          ...prev[destKey].tasks.slice(0, newIndex >= 0 ? newIndex : 0),
          movedTask,
          ...prev[destKey].tasks.slice(newIndex >= 0 ? newIndex : 0),
        ],
      },
    }));
  };

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    if (!sourceKey) return;

    const destKey = columns[over.id]
      ? over.id
      : Object.keys(columns).find((key) =>
          columns[key].tasks.some((task) => task.id === over.id)
        );
    if (!destKey || sourceKey === destKey) return;

    const taskToMove = columns[sourceKey].tasks.find((t) => t.id === active.id);
    if (!taskToMove) return;

    const destStatus = statuses.find((s) => s.label === destKey);
    if (!destStatus) {
      toast.error("Không tìm thấy trạng thái đích");
      return;
    }

    const previousColumns = { ...columns };

    setColumns((prev) => {
      const updated = { ...prev };
      updated[sourceKey].tasks = updated[sourceKey].tasks.filter(
        (t) => t.id !== active.id
      );
      updated[destKey].tasks = [
        { ...taskToMove, statusLabel: destKey },
        ...updated[destKey].tasks,
      ];
      return updated;
    });

    try {
      await updateTaskStatus(
        taskToMove.id,
        taskToMove.statusCode,
        destStatus.code // hoặc destStatus._id nếu backend yêu cầu
      );

      toast.success("Cập nhật trạng thái thành công");

      dispatch(
        getListTaskByProjectId({ projectId: idProject, page: 1, limit: 100 })
      );
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái");
      setColumns(previousColumns); // revert
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="mt-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={(e) => {
          onDragEnd(e);
          setActiveId(null);
        }}
      >
        <div className="flex h-full">
          {Object.entries(columns).map(([key, column]) => (
            <KanbanColumn
              key={key}
              columnId={key}
              column={column}
              setSelectedTasks={setSelectedTasks}
              selectedTasks={selectedTasks}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId &&
            (() => {
              const task = Object.values(columns)
                .flatMap((col) => col.tasks)
                .find((t) => t.id === activeId);
              return task ? (
                <div className="p-4 bg-white shadow-lg rounded-md w-[160px]">
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-gray-500 text-center">
                    {task.userName}
                  </p>
                </div>
              ) : null;
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
