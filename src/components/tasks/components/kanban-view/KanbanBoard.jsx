import { closestCorners, DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { updateTaskStatus } from "../../../../services/taskService";
import { useSearchParams } from "react-router-dom";
import "../../styles/KanbaBoard.scss";
import { getListTaskByProjectIdRedux } from "../../../../redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const STATUS_MAP = {
  1: "PREPARE",
  2: "IN_PROGRESS",
  3: "TEST",
  4: "FINISH",
  5: "CLOSE",
  6: "PAUSE",
  7: "NOT_DO",
};

const REVERSE_STATUS_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([key, value]) => [value, Number(key)])
);

const INITIAL_COLUMNS = Object.keys(STATUS_MAP).reduce((acc, key) => {
  acc[STATUS_MAP[key]] = { title: getStatusTitle(STATUS_MAP[key]), tasks: [] };
  return acc;
}, {});

function getStatusTitle(status) {
  const titles = {
    PREPARE: "Công việc mới",
    IN_PROGRESS: "Đang thực hiện",
    TEST: "Kiểm thử",
    FINISH: "Hoàn thành",
    CLOSE: "Đóng công việc",
    PAUSE: "Tạm dừng",
    NOT_DO: "Khóa công việc",
  };
  return titles[status] || "Công việc khác";
}

function transformTasksData(tasks) {
  return tasks.reduce((acc, task) => {
    const columnKey = STATUS_MAP[task.status] || "PREPARE";
    acc[columnKey].tasks.push({
      ...task,
      id: task._id,
      userName: task.assigneeId.length > 0 ? task.assigneeId[0].userName : "Chưa giao",
      assigneeUserNames: task.assigneeId.map((assignee) => assignee.userName),
      assigneeId: task.assigneeId.map((assignee) => ({ ...assignee, id: assignee._id })),
    });
    return acc;
  }, JSON.parse(JSON.stringify(INITIAL_COLUMNS)));
}

export default function KanbanBoard({ selectedTasks, setSelectedTasks, searchTerm }) {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");

  useEffect(() => {
    if (idProject) {
      dispatch(getListTaskByProjectIdRedux(idProject));
    }
  }, [idProject, dispatch]);

  useEffect(() => {
    if (listTask?.length) {
      setColumns(transformTasksData(listTask));
    }
  }, [listTask]);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );

    const destinationColumnKey = Object.keys(columns).includes(over.id)
      ? over.id
      : Object.keys(columns).find((key) =>
          columns[key].tasks.some((task) => task.id === over.id)
        );

    if (!sourceColumnKey || !destinationColumnKey || sourceColumnKey === destinationColumnKey) return;

    const taskToMove = columns[sourceColumnKey].tasks.find((task) => task.id === active.id);
    if (!taskToMove) return;

    const newStatus = REVERSE_STATUS_MAP[destinationColumnKey];

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceColumnKey].tasks = newColumns[sourceColumnKey].tasks.filter((task) => task.id !== active.id);
      const updatedTask = { ...taskToMove, status: newStatus };
      newColumns[destinationColumnKey].tasks = [updatedTask, ...newColumns[destinationColumnKey].tasks];
      return newColumns;
    });

    try {
      if (taskToMove.status !== undefined) {
        await updateTaskStatus(taskToMove.id, taskToMove.status, newStatus);
        toast.success("Cập nhật trạng thái thành công");
        setTimeout(() => {
          dispatch(getListTaskByProjectIdRedux(idProject));
        }, 500);
      }
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="kanban-wrapper">
      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="kanban-container">
          {Object.entries(columns).map(([key, column]) => (
            <KanbanColumn
              key={key}
              columnId={key}
              column={column}
              setSelectedTasks={setSelectedTasks}
              selectedTasks={selectedTasks}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
