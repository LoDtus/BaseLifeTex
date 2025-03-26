import { closestCorners, DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanTaskCard from "./KanbanTaskCard";
import { getTasksByProject, updateTaskStatus } from "../../services/taskService";
import { useSearchParams } from "react-router-dom";
import "./KanbaBoard.scss";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";

// Hàm ánh xạ dữ liệu từ server sang các cột Kanban
function transformTasksData(tasks) {
  return tasks.reduce((acc, task) => {
    const statusMap = {
      0: "PREPARE", // Công việc mới
      1: "IN_PROGRESS", // Đang thực hiện
      2: "FINISH", // Hoàn thành
      3: "NOT_DO", // Không làm
    };

    const columnKey = statusMap[task.status] || "PREPARE";

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
    PREPARE: { title: "Công việc mới", tasks: [] },
    IN_PROGRESS: { title: "Đang thực hiện", tasks: [] },
    FINISH: { title: "Hoàn thành", tasks: [] },
    NOT_DO: { title: "Khóa công việc", tasks: [] },
  });
}

// Hàm lấy tiêu đề cho từng trạng thái
function getStatusTitle(status) {
  const titles = {
    PREPARE: "Công việc mới",
    IN_PROGRESS: "Đang thực hiện",
    FINISH: "Hoàn thành",
    NOT_DO: "Khóa công việc",
  };
  return titles[status] || "Công việc khác";
}

function KanbanBoard() {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const [taskToUpdate, setTaskToUpdate] = useState(null);
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

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Tìm cột nguồn và cột đích
    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === active.id)
    );
    const destinationColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === over.id)
    ) || over.id; // Nếu over.id là ID của cột

    if (!sourceColumnKey) return;

    // Nếu kéo thả trong cùng một cột
    if (sourceColumnKey === destinationColumnKey) {
      const sourceColumn = columns[sourceColumnKey];
      const oldIndex = sourceColumn.tasks.findIndex((task) => task.id === active.id);
      const newIndex = sourceColumn.tasks.findIndex((task) => task.id === over.id);

      if (oldIndex === newIndex) return;

      // Sắp xếp lại task trong cùng cột
      const newTasks = [...sourceColumn.tasks];
      const [movedTask] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);

      setColumns((prev) => ({
        ...prev,
        [sourceColumnKey]: {
          ...sourceColumn,
          tasks: newTasks,
        },
      }));
      return;
    }

    // Nếu kéo thả giữa các cột
    const taskToMove = columns[sourceColumnKey].tasks.find(
      (task) => task.id === active.id
    );

    if (!taskToMove) return;

    const statusMapReverse = {
      PREPARE: 0,
      IN_PROGRESS: 1,
      FINISH: 2,
      NOT_DO: 3,
    };

    taskToMove.status = statusMapReverse[destinationColumnKey];

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
        onDragEnd={onDragEnd}
      >
        <div className="kanban-container">
          {Object.entries(columns).map(([key, column]) => (
            <KanbanColumn key={key} columnId={key} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;