import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core"; // Thêm DragOverlay
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanTaskCard from "./KanbanTaskCard"; // Thêm import để sử dụng trong DragOverlay
import { getTasksByProject, updateTaskStatus } from "../../services/taskService";
import { useSearchParams } from "react-router-dom";
import "./KanbaBoard.scss";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";

function transformTasksData(tasks) {
  return tasks.reduce((acc, task) => {
    const statusMap = {
      pending: "pending",
      inProgress: "inProgress",
      completed: "completed",
      done: "done",
    };

    const columnKey = statusMap[task.status] || "pending";

    if (!acc[columnKey]) {
      acc[columnKey] = {
        title: getStatusTitle(columnKey),
        tasks: [],
      };
    }

    acc[columnKey].tasks.push({
      ...task,
      id: task._id,
      userName: task.assigneeId.length > 0 ? task.assigneeId[0].userName : "Chưa giao",
      assigneeUserNames: task.assigneeId.map((assignee) => assignee.userName),
      assigneeId: task.assigneeId.map((assignee) => ({
        ...assignee,
        id: assignee._id,
      })),
    });

    return acc;
  }, {
    pending: { title: "Công việc mới", tasks: [] },
    inProgress: { title: "Đang thực hiện", tasks: [] },
    completed: { title: "Hoàn thành", tasks: [] },
    done: { title: "Kết thúc", tasks: [] },
  });
}

function getStatusTitle(status) {
  const titles = {
    pending: "Công việc cần làm",
    inProgress: "Công việc đang làm",
    completed: "Công việc đã hoàn thành",
    done: "Công việc đã xong",
  };
  return titles[status] || "Công việc khác";
}

function KanbanBoard() {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [activeTask, setActiveTask] = useState(null); // State để lưu task đang kéo
  const idProject = searchParams.get("idProject");

  const fetchData = async () => {
    try {
      dispatch(getListTaskByProjectIdRedux(idProject));
    } catch (error) {
      console.error("Lấy danh sách công việc thất bại:", error);
    }
  };

  useEffect(() => {
    if (listTask && listTask.length > 0) {
      const formattedData = transformTasksData(listTask);
      setColumns(formattedData);
    }
  }, [listTask]);

  useEffect(() => {
    if (idProject) {
      fetchData();
    }
  }, [idProject, dispatch]);

  const onDragStart = (event) => {
    const { active } = event;
    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === active.id)
    );
    if (sourceColumnKey) {
      const task = columns[sourceColumnKey].tasks.find((task) => task.id === active.id);
      setActiveTask(task); // Lưu task đang kéo vào state
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null); // Reset activeTask khi kéo thả kết thúc
      return;
    }

    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === active.id)
    );

    if (!sourceColumnKey) {
      setActiveTask(null);
      return;
    }

    const destinationColumnKey = over.id;

    if (sourceColumnKey === destinationColumnKey) {
      setActiveTask(null);
      return;
    }

    const taskToMove = columns[sourceColumnKey].tasks.find(
      (task) => task.id === active.id
    );

    if (!taskToMove) {
      setActiveTask(null);
      return;
    }

    taskToMove.status = destinationColumnKey;

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceColumnKey].tasks = newColumns[sourceColumnKey].tasks.filter(
        (task) => task.id !== active.id
      );
      newColumns[destinationColumnKey].tasks = [
        ...newColumns[destinationColumnKey].tasks,
        taskToMove,
      ];
      return newColumns;
    });

    setTaskToUpdate(taskToMove);
    setActiveTask(null); // Reset activeTask khi kéo thả kết thúc
  };

  useEffect(() => {
    if (taskToUpdate) {
      updateTaskStatus(taskToUpdate.id, taskToUpdate.status)
        .then(() => {
          console.log("Cập nhật thành công");
          fetchData();
        })
        .catch((error) => console.error("Lỗi cập nhật:", error))
        .finally(() => setTaskToUpdate(null));
    }
  }, [taskToUpdate]);

  return (
    <div className="kanban-wrapper">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={onDragStart} // Thêm sự kiện onDragStart
        onDragEnd={onDragEnd}
      >
        <div className="kanban-container">
          {Object.entries(columns).map(([key, column]) => (
            <KanbanColumn key={key} columnId={key} column={column} />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCard task={activeTask} isOverlay={true} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;