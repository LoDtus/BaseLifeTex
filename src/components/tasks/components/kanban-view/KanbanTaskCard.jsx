import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Popover, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
// import KanbanCards from "../../styles/KanbanCard.module.scss";
import TaskDetailView from "../task-details/TaskDetailView";
import ListIcon from "@mui/icons-material/List";
import { useEffect } from "react";

export default function KanbanTaskCard({
  selectedTasks,
  setSelectedTasks,
  task,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease, opacity 0.2s ease", // Thêm transition cho transform và opacity
    opacity: isDragging ? 0.6 : 1,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [isKanbaLabel, setIsKanbaLabel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (event) => {
    // event.preventDefault();
    event.stopPropagation();
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };
  const handleLabelClick = (event) => {
    event.stopPropagation();
    setIsKanbaLabel((prev) => !prev);
  };
  const open = Boolean(anchorEl);
  const primaryUserName =
    task.assigneeUserNames && task.assigneeUserNames.length > 0
      ? task.assigneeUserNames[0]
      : "Chưa giao";
  const remainingUserNames =
    task.assigneeUserNames && task.assigneeUserNames.length > 1
      ? task.assigneeUserNames.slice(1)
      : [];
  const handleSelectTask = (event, taskId) => {
    event.stopPropagation();
    const updatedSelection = selectedTasks.includes(taskId)
      ? selectedTasks.filter((id) => id !== taskId)
      : [...selectedTasks, taskId];
    setSelectedTasks(updatedSelection);
  };
  const handleButtonClick = React.useCallback((event) => {
    event.stopPropagation();
    setIsModalOpen((prev) => !prev);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal khi cần
  };
  const handlePointerDown = (event) => {
    event.stopPropagation();
  };
  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        // className={`kanban-card ${isDragging ? "dragging" : ""}`}
        className="mt-1 bg-white border !border-gray-border rounded-md
                cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start p-2 border-b border-gray-border">
          <div className="grow">
            <Tooltip
              className="line-clamp-2 font-semibold"
              classes={{ tooltip: "custom-tooltip" }}
              title={task.title}
              placement="top"
              arrow
              // onPointerDown={handlePointerDown}
              // onClick={handleButtonClick}
            >
              {task.title}
            </Tooltip>
            <span className="text-[12px]" onClick={handleLabelClick}>
              {isKanbaLabel
                ? `Kanban ${task.id}`
                : `${dayjs(task.endDate).format("DD/MM/YYYY") || "Chưa giao"}`}
            </span>
          </div>
          <input
            type="checkbox"
            checked={selectedTasks.includes(task._id)}
            onChange={(e) => {
              handleSelectTask(e, task._id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="">
          <div className="flex items-center py-1 px-2">
            <div className="!text-gray cursor-pointer duration-200 !hover:text-black !active:scale-90">
              {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-[20px] h-[20px] aspect-square "
                  onPointerDown={handlePointerDown}
                  onClick={handleButtonClick}
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg> */}
              <button
                onPointerDown={handlePointerDown}
                onClick={handleButtonClick}
                style={{
                  border: "1px solid",
                  borderRadius: "7px",
                  background: "aliceblue",
                }}
              >
                🔍
              </button>
            </div>
            <div className="grow"></div>
            {task.assigneeId.map((member, i) => {
              if (i < 3) {
                return (
                  <div>
                    <img
                      className="w-[25px] h-[25px] rounded-full cursor-pointer !ml-[2px]"
                      src={member.avatar}
                      alt={member.email}
                    />
                  </div>
                );
              }
            })}
            {/* <div
                            className="assignee-toggle"
                            style={{
                                cursor: "pointer",
                                marginLeft: "5px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span
                                onClick={handleClick}
                                onMouseDown={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                style={{ fontSize: "12px" }}
                            >
                                ▼
                            </span>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                                sx={{ mt: 1 }}
                            >
                                <div
                                    style={{
                                        padding: "20px",
                                        maxWidth: "250px",
                                        position: "relative",
                                    }}
                                >
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleClose}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            padding: "5px",
                                        }}
                                    >
                                        <CloseIcon style={{ fontSize: "18px" }} />
                                    </IconButton>
                                    <div style={{ marginRight: "40px" }}>
                                        <strong
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                                fontSize: "14px",
                                            }}
                                        >
                                            Danh sách người tham gia:
                                        </strong>
                                        <ul
                                            style={{
                                                margin: 0,
                                                paddingLeft: "20px",
                                                listStyleType: "disc",
                                            }}
                                        >
                                            {remainingUserNames.map((userName, index) => (
                                                <li
                                                    key={index}
                                                    style={{
                                                        marginBottom: "8px",
                                                        lineHeight: "1.5",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {userName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Popover>
                        </div> */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskDetailView
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          task={task}
        />
      )}
    </div>
  );
}
