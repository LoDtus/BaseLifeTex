import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
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
    // Ánh xạ trạng thái từ server (1, 2, 4, 7) sang key của cột
    const statusMap = {
      1: "PREPARE", // Công việc mới
      2: "IN_PROGRESS", // Đang thực hiện
      4: "FINISH", // Hoàn thành
      7: "NOT_DO", // Không làm
    };

    const columnKey = statusMap[task.status] || "PREPARE"; // Mặc định là PREPARE nếu không tìm thấy

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
    NOT_DO: { title: "Không làm", tasks: [] },
  });
}

// Hàm lấy tiêu đề cho từng trạng thái
function getStatusTitle(status) {
  const titles = {
    PREPARE: "Công việc mới",
    IN_PROGRESS: "Đang thực hiện",
    FINISH: "Hoàn thành",
    NOT_DO: "Không làm",
  };
  return titles[status] || "Công việc khác";
}

function KanbanBoard() {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
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
      setActiveTask(task);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
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

    // Ánh xạ trạng thái từ key của cột sang giá trị số để gửi lên server
    const statusMapReverse = {
      PREPARE: 1,
      IN_PROGRESS: 2,
      FINISH: 4,
      NOT_DO: 7,
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
    setActiveTask(null);
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
        onDragStart={onDragStart}
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