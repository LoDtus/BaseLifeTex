import { closestCorners, DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import KanbanColumn from './KanbanColumn';
import { getTasksByProject, updateTaskStatus } from '../../services/taskService';
import { useSearchParams } from 'react-router-dom';

function transformTasksData(tasks) {
    return tasks.reduce((acc, task) => {
        const statusMap = {
            "pending": "pending",
            "inProgress": "inProgress",
            "completed": "completed",
            "done": "done"
        };

        const columnKey = statusMap[task.status] || "todo"; // Mặc định là "todo" nếu không tìm thấy

        if (!acc[columnKey]) {
            acc[columnKey] = {
                title: getStatusTitle(columnKey),
                tasks: []
            };
        }

        acc[columnKey].tasks.push({
            ...task,
            id: task._id,  // Đổi _id thành id
            assigneeId: task.assigneeId.map(assignee => ({
                ...assignee,
                id: assignee._id // Đổi _id thành id trong assigneeId
            }))
        });

        return acc;
    }, {
        pending: { title: "Công việc cần làm", tasks: [] },
        inProgress: { title: "Công việc đang làm", tasks: [] },
        completed: { title: "Công việc đã hoàn thành", tasks: [] },
        done: { title: "Công việc đã xong", tasks: [] }
    });
}

function getStatusTitle(status) {
    const titles = {
        pending: "Công việc cần làm",
        inProgress: "Công việc đang làm",
        completed: "Công việc đã hoàn thành",
        done: "Công việc đã xong"
    };
    return titles[status] || "Công việc khác";
}

function KanbanBoard() {
    const [columns, setColumns] = useState({});
    const [searchParams] = useSearchParams();
    const [taskToUpdate, setTaskToUpdate] = useState(null);
    const idProject = searchParams.get("idProject");

    const fetchData = async () => {
        const data = await getTasksByProject(idProject);
        const formattedData = transformTasksData(data.data);

        setColumns(formattedData);
    };

    useEffect(() => {
        fetchData();
    }, [idProject]);

    const onDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const sourceColumnKey = Object.keys(columns).find((key) => {
            return columns[key].tasks.find((task) => task.id === active.id);
        });

        if (!sourceColumnKey) return;

        const destinationColumnKey = over.id;

        if (sourceColumnKey === destinationColumnKey) return;

        const taskToMove = columns[sourceColumnKey].tasks.find((task) => task.id === active.id);


        if (!taskToMove) return;

        taskToMove.status = destinationColumnKey;

        setColumns((prev) => {
            const newColumns = { ...prev };

            // Xóa task khỏi cột nguồn
            newColumns[sourceColumnKey].tasks = newColumns[sourceColumnKey].tasks.filter((task) => task.id !== active.id);

            // Thêm task vào cột đích
            newColumns[destinationColumnKey].tasks = [...newColumns[destinationColumnKey].tasks, taskToMove];

            return newColumns;
        });
        setTaskToUpdate(taskToMove);
    }

    useEffect(() => {
        if (taskToUpdate) {
            console.log(taskToUpdate);
            
            updateTaskStatus(taskToUpdate.id, taskToUpdate.status)
                .then(() => console.log("Cập nhật thành công"))
                .catch((error) => console.error("Lỗi cập nhật:", error))
                .finally(() => setTaskToUpdate(null)); // Reset state sau khi gọi API
        }
    }, [taskToUpdate])


    return (
        <Box sx={{ overflowX: "auto" }}>
            {columns && <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    {Object.entries(columns).map(([key, column]) => (
                        <Grid item xs={3} key={key}>
                            <Paper sx={{ p: 2, backgroundColor: "#f4f4f4" }}>
                                <Typography variant="h6">{column.title}</Typography>
                                <SortableContext items={column.tasks.map((task) => task.id)}>
                                    <KanbanColumn columnId={key} tasks={column.tasks} />
                                </SortableContext>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DndContext>}
        </Box>

    )
}


export default KanbanBoard