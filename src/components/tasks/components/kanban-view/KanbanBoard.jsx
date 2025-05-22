

import {
  closestCorners,
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  DragOverlay,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates,arrayMove } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { updateTaskStatus } from "@/services/taskService";
import { useSearchParams } from "react-router-dom";
import { getListTaskByProjectId } from "@/redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchWorkflowSteps,clearWorkflowSteps } from "@/redux/statusSlice";
import {
  fetchWorkflowTransitions,


} from "@/redux/workflowSlice";
function KanbanBoard({projectId ,selectedTasks, setSelectedTasks }) {
  const dispatch = useDispatch();
    const workflowId = useSelector((state) => state.status.workflowId);
const userRole = useSelector((state) => state.auth.user?.role);
  const listTask = useSelector((state) => state.task.listTask);
console.log("chekclistTask", listTask);
  const workflowSteps = useSelector((state) => state.status.steps);
   const workflowTransitions = useSelector((state) => state.workflow.transitions);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const [activeId, setActiveId] = useState(null);
  const colors = [
 "#ffe5e5", // đỏ rất nhạt
  "#ffefd6", // cam rất nhạt
  "#ffffe0", // vàng rất nhạt
  "#e6fff2", // xanh nhạt pha trắng
  "#e0faff", // xanh da trời nhạt hơn
  "#e6eeff", // xanh dương pha trắng
  "#eeeaff", // tím rất nhạt
  "#fff0f5", // hồng pastel
  "#eafff5", // xanh bạc hà pha trắng
  "#f7f7ff", 
  ];
    useEffect(() => {
    if (workflowId) {
      dispatch(fetchWorkflowSteps(workflowId));
      dispatch(fetchWorkflowTransitions(workflowId));
    }
  }, [dispatch, workflowId]);
  // console.log("checkworkflowId", workflowId);
  useEffect(() => {
  if (idProject) {
    dispatch(clearWorkflowSteps()); // 👈 reset steps trước khi fetch mới
    dispatch(fetchWorkflowSteps(idProject));
    dispatch(getListTaskByProjectId({ projectId: idProject }));
  }
}, [idProject, dispatch]);
// console.log("checkidproject", idProject)
 useEffect(() => {
  if (workflowSteps.length > 0 ) {
    const initialColumns = {};

    workflowSteps.forEach((step, index) => {
      initialColumns[step._id] = {
        id: step._id,
        title: step.nameStep,
        color: colors[index % colors.length],
        tasks: [],
      };
    });

listTask.forEach((task) => {
  const stepId = typeof task.status === "object" ? task.status?._id : task.status || workflowSteps[0]._id;
  if (initialColumns[stepId]) {
    initialColumns[stepId].tasks.push({
      ...task,
      id: task._id,
      nameStep:
        Array.isArray(task.assigneeId) && task.assigneeId[0]?.nameStep
          ? task.assigneeId[0].nameStep
          : "Chưa giao",
    });
  }
});

    setColumns(initialColumns);
  }
}, [workflowSteps, listTask]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragOver = (event) => {
 const { active, over } = event;
    if (!over) return;

    const sourceKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    const destKey = Object.keys(columns).find((key) => key === over.id);
    if (!sourceKey || !destKey || sourceKey === destKey) return;

    // Kiểm tra quyền: có luồng chuyển cho role user không?
    const allowedTransition = workflowTransitions.find(
      (t) =>
        t.fromStep === sourceKey &&
        t.toStep === destKey &&
        t.allowedRoles.includes(userRole)
    );
    if (!allowedTransition) {
      // Nếu không có quyền thì không cho hover chuyển sang cột khác
      return;
    }

    const sourceTasks = [...columns[sourceKey].tasks];
    const movedTaskIndex = sourceTasks.findIndex((t) => t.id === active.id);
    const [movedTask] = sourceTasks.splice(movedTaskIndex, 1);

    const destTasks = [...columns[destKey].tasks];
    destTasks.unshift(movedTask);

    setColumns({
      ...columns,
      [sourceKey]: { ...columns[sourceKey], tasks: sourceTasks },
      [destKey]: { ...columns[destKey], tasks: destTasks },
    });
  };

  const onDragEnd = async (event) => {
     const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const sourceKey = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    const destKey = over.id;
    if (!sourceKey || !destKey || sourceKey === destKey) return;

    // Kiểm tra quyền chuyển trạng thái
    const allowedTransition = workflowTransitions.find(
      (t) =>
        t.fromStep === sourceKey &&
        t.toStep === destKey &&
        t.allowedRoles.includes(userRole)
    );

    if (!allowedTransition) {
      toast.error("Bạn không có quyền chuyển task sang trạng thái này");
      // Reset lại columns để task trở về vị trí cũ
      setColumns((prevColumns) => {
        // Có thể reload lại tasks hoặc giữ nguyên prevColumns nếu onDragOver đã cản
        return prevColumns;
      });
      return;
    }

    const movedTask = columns[sourceKey].tasks.find((t) => t.id === active.id);
    if (!movedTask) return;
    try {
      await updateTaskStatus(movedTask.id, sourceKey, destKey);
      toast.success("Cập nhật trạng thái thành công");
      dispatch(getListTaskByProjectId({ projectId: idProject }));
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="mt-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex h-full">
    {Object.entries(columns).map(([key, column]) => {
  {/* console.log(`Column ${column.title} has tasks:`, column.tasks); */}
  return (
    <KanbanColumn
      key={key}
      columnId={key}
      column={column}
      selectedTasks={selectedTasks}
      setSelectedTasks={setSelectedTasks}
    />
  );
})}
        </div>
        <DragOverlay>
          {activeId &&
            (() => {
              const task = Object.values(columns)
                .flatMap((col) => col.tasks)
                .find((t) => t.id === activeId);
              return task ? (
                <div className="p-4 bg-white shadow rounded w-[160px]">
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


