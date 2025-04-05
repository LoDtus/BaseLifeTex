import {
  closestCorners,
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { updateTaskStatus } from "@/services/taskService";
import { useSearchParams } from "react-router-dom";
import "../../styles/KanbaBoard.scss";
import { getListTaskByProjectId } from "@/redux/taskSlice";
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

// Hàm lấy tiêu đề cho từng trạng thái
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

const INITIAL_COLUMNS = Object.keys(STATUS_MAP).reduce((acc, key) => {
  acc[STATUS_MAP[key]] = { title: getStatusTitle(STATUS_MAP[key]), tasks: [] };
  return acc;
}, {});

const statusList = [
  "PREPARE",
  "IN_PROGRESS",
  "TEST",
  "FINISH",
  "CLOSE",
  "PAUSE",
  "NOT_DO",
];
const initialCols = statusList.map((status) => ({
  id: status,
  title: getStatusTitle(status),
  task: [],
}));

// Hàm ánh xạ dữ liệu từ server sang các cột Kanban
function transformTasksData(tasks) {
  return tasks.reduce(
    (acc, task) => {
      const statusMap = {
        1: "PREPARE", // Công việc mới
        2: "IN_PROGRESS", // Đang thực hiện
        3: "TEST",
        4: "FINISH", // Hoàn thành
        5: "CLOSE",
        6: "PAUSE",
        7: "NOT_DO", // Khóa công việc
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
        userName:
          task.assigneeId.length > 0
            ? task.assigneeId[0].userName
            : "Chưa giao",
        assigneeUserNames: task.assigneeId.map((assignee) => assignee.userName),
        assigneeId: task.assigneeId.map((assignee) => ({
          ...assignee,
          id: assignee._id,
        })),
      });
      return acc;
    },
    {
      PREPARE: { title: "Công việc mới", tasks: [] },
      IN_PROGRESS: { title: "Đang thực hiện", tasks: [] },
      TEST: { title: "Kiểm thử", tasks: [] },
      FINISH: { title: "Hoàn thành", tasks: [] },
      CLOSE: { title: "Đóng công việc", tasks: [] },
      PAUSE: { title: "Tạm dừng", tasks: [] },
      NOT_DO: { title: "Khóa công việc", tasks: [] },
    }
  );
}

function KanbanBoard({ selectedTasks, setSelectedTasks }) {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  // const [columns, setColumns] = useState(initialCols);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");

  // console.log(initialCols);

  // useEffect(() => {
  //     console.log(columns);

  // }, [columns]);

  useEffect(() => {
    if (listTask && listTask.length > 0) {
      const formattedData = transformTasksData(listTask);
      setColumns(formattedData);
    } else {
      setColumns({
        PREPARE: { title: "Công việc mới", tasks: [] },
        IN_PROGRESS: { title: "Đang thực hiện", tasks: [] },
        TEST: { title: "Kiểm thử", tasks: [] },
        FINISH: { title: "Hoàn thành", tasks: [] },
        CLOSE: { title: "Đóng công việc", tasks: [] },
        PAUSE: { title: "Tạm dừng", tasks: [] },
        NOT_DO: { title: "Khóa công việc", tasks: [] },
      });
    }
  }, [listTask]);

  useEffect(() => {
    if (idProject) {
      dispatch(
        getListTaskByProjectId({
          projectId: idProject,
          page: 1,
          limit: 100,
        })
      );
    }
  }, [idProject, dispatch]);

  // const onDragStart = (event) => {
  //   const { active } = event;
  //   // Có thể thêm logic nếu cần khi bắt đầu kéo
  // };

  // function findColumn(unique) {
  //     if (!unique) {
  //         return null;
  //     }

  //     if (columns.some((c) => c.id === unique)) {
  //         return columns.find((c) => c.id === unique) ?? null;
  //     }
  //     const id = unique;
  //     const itemWithColumnId = columns.flatMap((c) => {
  //         const columnId = c.id;
  //         return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
  //     });
  //     const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
  //     return columns.find((c) => c.id === columnId) ?? null;
  // };

  const onDragOver = (event) => {
    const { active, over, delta } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    // const activeColumn = findColumn(activeId);
    // const overColumn = findColumn(overId);

    if (!over) {
      return null;
    }

    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    if (!sourceColumnKey) return;
    const destinationColumnKey = Object.keys(columns).includes(over.id)
      ? over.id
      : Object.keys(columns).find((key) =>
          columns[key].tasks.some((task) => task.id === over.id)
        );

    if (!destinationColumnKey) return;
    if (sourceColumnKey === destinationColumnKey) {
      const sourceColumn = columns[sourceColumnKey];
      const oldIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === active.id
      );
      const newIndex =
        over.id in columns
          ? 0
          : sourceColumn.tasks.findIndex((task) => task.id === over.id);

      if (oldIndex === newIndex) return;
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
    }

    // if (!activeColumn || !overColumn || activeColumn !== overColumn) {
    //     return null;
    // }

    // const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    // const overIndex = overColumn.cards.findIndex((i) => i.id === overId);

    // if (activeIndex !== overIndex) {
    //     setColumns((prevState) => {
    //         return prevState.map((column) => {
    //             if (column.id === activeColumn.id) {
    //                 column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
    //                 return column;
    //             } else {
    //                 return column;
    //             }
    //         });
    //     });
    // }
  };

  const onDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === active.id)
    );

    if (!sourceColumnKey) return;

    const sourceColumn = columns[sourceColumnKey];
    const oldIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === active.id
    );

    if (oldIndex === -1) return;

    let destinationColumnKey;
    if (over.id in columns) {
      destinationColumnKey = over.id;
    } else {
      destinationColumnKey = Object.keys(columns).find((key) =>
        columns[key].tasks.find((task) => task.id === over.id)
      );
    }

    if (!destinationColumnKey || sourceColumnKey === destinationColumnKey)
      return;

    const taskToMove = columns[sourceColumnKey].tasks.find(
      (task) => task.id === active.id
    );
    if (!taskToMove) return;

    const previousColumns = { ...columns };

    const taskInfo = { ...taskToMove, sourceColumnKey, oldIndex };

    const statusMapReverse = {
      PREPARE: 1,
      IN_PROGRESS: 2,
      TEST: 3,
      FINISH: 4,
      CLOSE: 5,
      PAUSE: 6,
      NOT_DO: 7,
    };

    const newStatus = statusMapReverse[destinationColumnKey];

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceColumnKey].tasks = newColumns[
        sourceColumnKey
      ].tasks.filter((task) => task.id !== active.id);
      const updatedTask = { ...taskToMove, status: newStatus };
      newColumns[destinationColumnKey].tasks = [
        updatedTask,
        ...newColumns[destinationColumnKey].tasks,
      ];
      return newColumns;
    });

    try {
      if (taskToMove.status !== undefined) {
        await updateTaskStatus(taskToMove.id, taskToMove.status, newStatus);
        toast.success("Cập nhật trạng thái thành công");
        setTimeout(() => {
          dispatch(
            getListTaskByProjectId({
              projectId: idProject,
              page: 1,
              limit: 100,
            })
          );
        }, 100);
      }
    } catch (error) {
      setColumns(previousColumns);
      toast.error("Có lỗi xảy ra, không thể thay đổi trạng thái");

      setColumns((prev) => {
        const newColumns = { ...prev };

        newColumns[destinationColumnKey].tasks = newColumns[
          destinationColumnKey
        ].tasks.filter((task) => task.id !== active.id);

        newColumns[taskInfo.sourceColumnKey].tasks.splice(
          taskInfo.oldIndex,
          0,
          taskToMove
        );

        return newColumns;
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="kanban-wrapper">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        // onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="kanban-container">
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
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
