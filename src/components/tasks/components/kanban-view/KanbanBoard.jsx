import { closestCorners, DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { updateTaskStatus } from "@/services/taskService";
import { useSearchParams } from "react-router-dom";
import "../../styles/KanbaBoard.scss";
import { getListTaskByProjectIdRedux } from "@/redux/taskSlice";
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

function KanbanBoard({ selectedTasks, setSelectedTasks, searchTerm }) {
    const dispatch = useDispatch();
    const listTask = useSelector((state) => state.task.listTask);
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [searchParams] = useSearchParams();
    const idProject = searchParams.get("idProject");

    // const fetchData = async () => {
    //     try {
    //         await dispatch(getListTaskByProjectIdRedux(idProject));
    //     } catch (error) {
    //         toast.error(
    //             "Lấy danh sách công việc thất bại",
    //             { autoClose: 3000 },
    //             error
    //         );
    //     }
    // };

    useEffect(() => {
        if (listTask && listTask.length > 0) {
            setColumns(transformTasksData(listTask));
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
            dispatch(getListTaskByProjectIdRedux(idProject));
        }
    }, [idProject, dispatch]);

    // const onDragStart = (event) => {
    //   const { active } = event;
    //   // Có thể thêm logic nếu cần khi bắt đầu kéo
    // };

    const onDragOver = (event) => {
        const { active, over } = event;

        if (!over) return;

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
    };

    const onDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const sourceColumnKey = Object.keys(columns).find((key) =>
            columns[key].tasks.find((task) => task.id === active.id)
        );

        if (!sourceColumnKey) return;

        let destinationColumnKey;
        if (over.id in columns) {
            destinationColumnKey = over.id;
        } else {
            destinationColumnKey = Object.keys(columns).find((key) =>
                columns[key].tasks.find((task) => task.id === over.id)
            );
        }

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
            return;
        }

        if (!sourceColumnKey || !destinationColumnKey || sourceColumnKey === destinationColumnKey) return;
        const taskToMove = columns[sourceColumnKey].tasks.find((task) => task.id === active.id);
        if (!taskToMove) return;

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
        const previousColumns = { ...columns };

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
            setColumns(previousColumns);
            toast.error("Cập nhật trạng thái công việc thất bại");
            throw error;
        }
    };

    return (
        <div className="kanban-wrapper">
            <DndContext
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
                            searchTerm={searchTerm}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}

export default KanbanBoard;
