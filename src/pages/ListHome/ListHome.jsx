import { useState, useEffect, useRef } from "react";
import "./ListHome.scss";
import "../Home/Home.scss";
import { useNavigate } from "react-router-dom";
import IssueForm from "../../components/IssueFrom/IssueForm";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import FilterDialog from "../../components/FilterForm/FilterDialog";

const initialTasks = [
  {
    id: 1,
    name: "fix header",
    assignees: ["image_4.png"],
    comments: "",
    startDate: "01/01/2029",
    endDate: "01/01/2029",
    status: "Hoàn thành",
    link: "https://",
  },
  {
    id: 2,
    name: "fix header",
    assignees: ["image_4.png"],
    comments: "",
    startDate: "01/01/2029",
    endDate: "01/01/2029",
    status: "Hoàn thành",
    link: "https://",
  },
  {
    id: 3,
    name: "fix header",
    assignees: ["image_4.png"],
    comments: "",
    startDate: "01/01/2029",
    endDate: "01/01/2029",
    status: "Hoàn thành",
    link: "https://",
  },
  {
    id: 4,
    name: "fix header",
    assignees: ["image_4.png"],
    comments: "",
    startDate: "01/01/2029",
    endDate: "01/01/2029",
    status: "Hoàn thành",
    link: "https://",
  },
  {
    id: 5,
    name: "fix header",
    assignees: ["image_4.png"],
    comments: "",
    startDate: "01/01/2029",
    endDate: "01/01/2029",
    status: "Hoàn thành",
    link: "https://",
  },
];

const TaskTable = () => {
  const navigate = useNavigate();
  const [anchorElFilter, setAnchorElFilter] = useState(null); // Anchor cho Filter
  const [anchorElMember, setAnchorElMember] = useState(null); // Anchor cho Member
  const inputRef = useRef(null);

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget); // Mở Popover Filter
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null); // Đóng Popover Filter
  };

  const handleClickMember = (event) => {
    setAnchorElMember(event.currentTarget); // Mở Popover Member
  };

  const handleCloseMember = () => {
    setAnchorElMember(null); // Đóng Popover Member
  };

  const handleClickMemberAdd = (event) => {
    setAnchorElMemberAdd(event.currentTarget);
  };

  const handleCloseMemberAdd = () => {
    setAnchorElMemberAdd(null);
  };

  const [open, setOpen] = useState(false);
  const [issueStatus, setIssueStatus] = useState("");

  const onClose = () => {
    setOpen(false);
    setIssueStatus("");
  };

  const openModal = (status = "Công việc mới") => {
    setIssueStatus(status);
    setOpen(true);
  };

  const openFilter = Boolean(anchorElFilter); // Trạng thái mở Popover Filter
  const openMember = Boolean(anchorElMember); // Trạng thái mở Popover Member
  const filterId = openFilter ? "filter-popover" : undefined;
  const memberId = openMember ? "member-popover" : undefined;

  // Khởi tạo tasks, hợp nhất initialTasks với localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("taskList");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    return [
      ...initialTasks,
      ...parsedTasks.filter(
        (task) => !initialTasks.some((initial) => initial.id === task.id)
      ),
    ];
  });

  // Lưu tasks vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(tasks));
  }, [tasks]);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");

  const handleEditClick = (taskId, currentName) => {
    setEditingTaskId(taskId);
    setEditedTaskName(currentName);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlurOrEnter = (event, taskId) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: editedTaskName } : task
      )
    );
    setEditingTaskId(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleIssueSubmit = (newIssue) => {
    const newTask = {
      id: tasks.length + 1,
      name: newIssue.issueName,
      assignees: newIssue.personName.map((id) => `image_${id}.png`),
      comments: "",
      startDate: newIssue.startDate.format("DD/MM/YYYY"),
      endDate: newIssue.endDate.format("DD/MM/YYYY"),
      status: newIssue.status,
      link: newIssue.link,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="task-table-container">
      {/* Header Section */}
      <div className="header-section">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <p className="text-gray-500 text-sm">Dự án / Phần mềm đánh giá</p>
          <div className="flex items-center gap-2">
            <img
              onClick={() => navigate("/")}
              src="image/Column.png"
              alt="LIFETEK"
              className="logo-img"
            />
            <img src="image/List.png" alt="LIFETEK" className="logo-img" />
          </div>
        </div>

        {/* Tìm kiếm & Avatars */}
        <div className="flex items-center gap-4">
          {/* Ô tìm kiếm */}
          <div className="search-container relative flex items-center">
            <svg
              className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m2.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />
            {/* Danh sách avatar */}
            <div className="flex -space-x-2 overflow-hidden">
              {[
                "image/image_4.png",
                "image/image_5.png",
                "image/image_6.png",
                "image/image_7.png",
                "image/image_8.png",
                "image/dot.png",
              ].map((avatar, index) => (
                <img
                  onClick={handleClickMember} // Gắn sự kiện mở danh sách nhân viên
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-8 h-8 rounded-full border border-white shadow"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Popover cho danh sách nhân viên */}
        <Popover
          id={memberId}
          open={openMember}
          anchorEl={anchorElMember}
          onClose={handleCloseMember}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ mt: 1 }}
        >
          <MemberListContent onClose={handleCloseMember} />
        </Popover>

        <div className="task-header1">
          <div onClick={() => openModal()} className="task-add1">
            <img src="image/Problem.png" alt="Add Task" />
            <p>Thêm vấn đề</p>
          </div>
          <div className="task-icons1">
            <img src="image/Trash.png" alt="List" />
            <img
              src="src/assets/image/Filter.png"
              alt="Columns"
              onClick={handleClickFilter} // Gắn sự kiện mở lọc công việc
              aria-describedby={filterId}
            />
          </div>
          {/* Popover cho lọc công việc */}
          <Popover
            id={filterId}
            open={openFilter}
            anchorEl={anchorElFilter}
            onClose={handleCloseFilter}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <FilterDialog />
          </Popover>
        </div>
      </div>

      {/* Bọc table trong wrapper để cuộn ngang */}
      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th></th> {/* Checkbox */}
              <th>STT</th>
              <th>Tên công việc</th>
              <th>Người nhận việc</th>
              <th>Bình luận</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{index + 1}</td>
                <td className="task-name">
                  {editingTaskId === task.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                      onBlur={(e) => handleBlurOrEnter(e, task.id)}
                      onKeyDown={(e) => handleBlurOrEnter(e, task.id)}
                    />
                  ) : (
                    <>
                      <img
                        src="image/Pen.png"
                        alt="edit"
                        className="edit-icon"
                        onClick={() => handleEditClick(task.id, task.name)}
                      />
                      {task.name}
                    </>
                  )}
                </td>
                <td className="assignees">
                  {task.assignees?.map((avatar, i) => (
                    <img
                      key={i}
                      src={`image/${avatar}`}
                      alt="user"
                      className="avatar"
                    />
                  ))}
                  <button className="add-user">+</button>
                </td>
                <td className="comment-cell">
                  <img
                    src="image/Chat_.png"
                    alt="comments"
                    className="comment-icon"
                  />
                </td>
                <td className="date-cell">
                  {task.startDate}
                  <img
                    src="image/Vector.png"
                    alt="start-date"
                    className="calendar-icon"
                  />
                </td>
                <td className="date-cell">
                  {task.endDate}
                  <img
                    src="image/Vector.png"
                    alt="end-date"
                    className="calendar-icon"
                  />
                </td>
                <td className="status-cell">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Công việc mới">Công việc mới</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Kết thúc">Kết thúc</option>
                  </select>
                </td>
                <td>
                  <a href={task.link} target="_blank" rel="noopener noreferrer">
                    🔗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <IssueForm
        isOpen={open}
        onClose={onClose}
        status={issueStatus}
        onSubmit={handleIssueSubmit}
      />
    </div>
  );
};

// Thêm CSS cho select
const styles = `
  .status-select {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
    cursor: pointer;
    outline: none;
  }
  .status-select:hover {
    border-color: #9ca3af;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TaskTable;