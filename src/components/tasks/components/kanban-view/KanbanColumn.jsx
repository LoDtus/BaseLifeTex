import { useContext, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import KanbanTaskCard from "./KanbanTaskCard";
import IssueForm from "../form/IssueForm";
import { useLocation, useSearchParams } from "react-router-dom";
import { setTaskForm } from "@/redux/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { mya } from "../../../../redux/Context";
import { getRoleIdProject } from "../../../../services/projectRoleService";

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
  // const idProject = searchParams.get("idProject");
  // const user = useSelector((state) => state.auth.login.currentUser.data.user);
const location = useLocation(); // lấy URL hiện tại
  const queryParams = new URLSearchParams(location.search); // phân tích chuỗi query
  const idProject = queryParams.get("idProject"); // lấy giá trị idProject
  const user = useSelector((state) => state.auth.login.currentUser.data.user);
  const {userPermissions, setUserPermissions} = useContext(mya)
  // const sortedTasks = [...column.tasks].sort((a, b) => b.priority - a.priority); // Tạo một bản sao của mảng tasks và sắp xếp theo độ ưu tiên (giảm dần)
  const sortedTasks = [...column.tasks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
useEffect(() => {
  (async () => {
    try {
      if (idProject) {
        const allRoles = await getRoleIdProject(idProject); // Gọi API lấy role
        console.log("All Roles:", allRoles);

        // Lọc role mà user hiện tại nằm trong userIds (so sánh từng u._id)
        const rolesOfUser = allRoles.filter(role =>
          role.userIds.some(u => u._id === user._id)
        );
        console.log("33333",rolesOfUser)
        // Gộp tất cả permissions lại (nếu có)
        const allPermissions = rolesOfUser.flatMap(role => role.permissions || []);

        // Loại bỏ quyền trùng lặp
        const uniquePermissions = [...new Set(allPermissions)];

        // Lưu vào state
        setUserPermissions(uniquePermissions);
      }
    } catch (error) {
      console.log(error);
    }
  })();
}, [idProject, user._id]);
  return (
    <div
      className={`h-full !ml-1 pd-2-custom border border-gray-border rounded-md bg-[#f4f5f7] overflow-y-auto overflow-x-hidden
                ${isOver ? "kanban-column-over" : ""}`}
      style={{
        backgroundColor: column.color || "#f4f5f7",
        height: "calc(100vh - 150px)",
        width: "14.2%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        position: "relative",
      }}
    >
      <div
        className="sticky top-0 z-10 "
        style={{ backgroundColor: column.color || "#f4f5f7" }}
      >
        <h3 className="flex items-center justify-center mb-2 mt-2">
          <span className="font-semibold !text-sm">{column.title}</span>
          <div className="text-[10px] font-semibold py-[2px] bg-[#dbddde] px-1 rounded-full !ml-1">
            <span>{column.tasks.length === 0 ? "" : column.tasks.length}</span>
          </div>
        </h3>
      {userPermissions.includes("Add") && (
          <button
            className="w-full py-1 px-2 bg-white text-dark-gray border border-dashed border-gray-border rounded-md
                    cursor-pointer duration-200 hover:text-black hover:border-black active:scale-90 mb-2"
            onClick={() => dispatch(setTaskForm("ADD"))}
          >
            Thêm công việc
          </button>
        )}
      </div>
      <div ref={setNodeRef} className="items-custom mt-0 pt-0">
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
