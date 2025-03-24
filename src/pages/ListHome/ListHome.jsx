import { useState, useEffect, useRef } from "react";
import "./ListHome.scss";
import "../Home/Home.scss";
import { useNavigate } from "react-router-dom";
import IssueForm from "../../components/IssueFrom/IssueForm";
import { Avatar, Button, Input, Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import FilterDialog from "../../components/FilterForm/FilterDialog";
import MemberListContentAdd from "../../components/memberListAdd/MemberListAdd";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useSearchParams } from "react-router-dom";
import { updateIssueData, updateIssueDataStatus } from "../../apis/Issue";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import LinkIcon from "@mui/icons-material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CommentModal from "../../components/commentModal/CommentModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KabanDetail from "../../components/kabanDetail/KabanDetail";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditForm from "../../components/editForm/EditForm";
import { useSelector, useDispatch } from "react-redux";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
const TaskTable = () => {
  const navigate = useNavigate();
  const [anchorElFilter, setAnchorElFilter] = useState(null); // Anchor cho Filter
  const [anchorElMember, setAnchorElMember] = useState(null); // Anchor cho Member
  const [anchorElMemberAdd, setAnchorElMemberAdd] = useState(null);
  const [anchorElMemberTask, setAnchorElMemberTask] = useState(null); // Anchor cho Member
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  // const [listTask, setListTask] = useState([]);
  const [openComment, setOpenComment] = useState(false);

  const { listTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListTaskByProjectIdRedux(idProject));
  }, [idProject]);

  const inputRef = useRef(null);

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget); // Mở Popover Filter
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null); // Đóng Popover Filter
  };

  const handleClickMember = (event) => {
    setAnchorElMember(event.currentTarget);
  };

  const handleCloseMember = () => {
    setAnchorElMember(null); // Đóng Popover Member
  };

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleClickMemberAdd = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId); // Lưu lại task được click
    setAnchorElMemberAdd(event.currentTarget);
  };

  const handleClickMemberTask = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId); // Lưu lại task được click
    setAnchorElMemberTask(event.currentTarget);
  };

  const handleCloseMemberTask = () => {
    setAnchorElMemberTask(null);
    setSelectedTaskId(null);
  };

  const handleCloseMemberAdd = () => {
    setAnchorElMemberAdd(null);
    setSelectedTaskId(null);
  };

  const [open, setOpen] = useState(false);
  const [issueStatus, setIssueStatus] = useState("Công việc mới");

  const onClose = () => {
    setOpen(false);
    setIssueStatus("");
    dispatch(getListTaskByProjectIdRedux(idProject));
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

  // Lưu tasks vào localStorage mỗi khi nó thay đổi

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingLinkTaskId, setEditingLinkTaskId] = useState(null);
  const [editingDateTaskId, setEditingDateTaskId] = useState(null);
  const [editingDateEndTaskId, setEditingDateEndTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [editedTaskLink, setEditedTaskLink] = useState("");
  const [idOpenComment, setIdOpenComment] = useState(null);
  const [editStartDate, setEditStartDate] = useState();
  const [editEndDate, setEditEndDate] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [idOpenDetail, setIdOpenDetail] = useState(null);

  const onOpenDetail = (taskId) => {
    setIdOpenDetail(taskId);
    setOpenDetail(true);
  };

  const closeDetail = () => {
    setIdOpenDetail(null);
    setOpenDetail(false);
  };

  const onOpenComment = (taskId) => {
    setIdOpenComment(taskId);
    setOpenComment(true);
  };

  const closeComment = () => {
    setIdOpenComment(null);
    setOpenComment(false);
  };

  const handleEditClick = (taskId, currentName) => {
    setEditingTaskId(taskId);
    setEditedTaskName(currentName);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditClickLink = (taskId, currentName) => {
    setEditingLinkTaskId(taskId);
    setEditedTaskLink(currentName);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditStartDate = (taskId, startDate) => {
    setEditingDateTaskId(taskId);
    setEditStartDate(startDate);
    // setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditEndDate = (taskId, end) => {
    setEditingDateEndTaskId(taskId);
    setEditEndDate(end);
    // setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlurOrEnter = async (event, task) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    const { _id, ...taskWithoutId } = task;
    try {
      const response = await updateIssueData(task._id, {
        ...taskWithoutId,
        assigneeId: task.assigneeId?.map((i) => i._id),
        assignerId: task.assignerId?._id,
        title: editedTaskName,
      });
      if (response.message === "Nhiệm vụ cập nhật thành công") {
        dispatch(getListTaskByProjectIdRedux(idProject));

        toast.success(response.message, { autoClose: 3000 });
      } else {
        toast.error(response.message, { autoClose: 3000 });
      }
      setEditedTaskName("");
      setEditingTaskId(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật task:", error);
    }
  };

  const handleBlurOrEnterLink = async (event, task) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    const { _id, ...taskWithoutId } = task;
    try {
      const response = await updateIssueData(task._id, {
        ...taskWithoutId,
        assigneeId: task.assigneeId?.map((i) => i._id),
        assignerId: task.assignerId?._id,
        link: editedTaskLink,
      });
      if (response.message === "Nhiệm vụ cập nhật thành công") {
        dispatch(getListTaskByProjectIdRedux(idProject));
        toast.success(response.message, { autoClose: 3000 });
      } else {
        toast.error(response.message, { autoClose: 3000 });
      }
      setEditedTaskLink("");
      setEditingLinkTaskId(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật task:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await updateIssueDataStatus(taskId, {
        status: newStatus,
      });
      if (response.message === "Thay đổi trạng thái task thành công") {
        dispatch(getListTaskByProjectIdRedux(idProject));

        toast.success(response.message, { autoClose: 3000 });
      } else {
        toast.error(response.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIssueSubmit = (newIssue) => {
    console.log(newIssue);
  };

  // Modal Edit
  const [editModal, setEditModal] = useState(false);
  const [idEditModal, setIdEditModal] = useState(null);

  const editModalOpen = (taskId) => {
    setEditModal(true);
    setIdEditModal(taskId);
  };

  const editModalClose = () => {
    setEditModal(false);
    setIdEditModal(null);
    dispatch(getListTaskByProjectIdRedux(idProject));
  };
  return (
    <div className="home-container">
      <ToastContainer />
      {/* Header Section */}
      <div className="header-section">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <div>
            <p
              style={{ fontSize: "13px", color: "#485F7E", fontWeight: "600" }}
              className="text-sm"
            >
              Dự án / Phần mềm đánh giá
            </p>
            <p
              style={{
                color: "#000",
                fontWeight: "600",
                fontSize: "20px",
                marginTop: "4px",
              }}
            >
              List
            </p>
          </div>

          <div className="flex items-center gap-2">
            <img
              onClick={() => navigate(`/home?idProject=${idProject}`)}
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
            <FilterDialog idProject={idProject} />
          </Popover>
        </div>
      </div>

      {/* Bọc table trong wrapper để cuộn ngang */}
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        style={{ paddingLeft: "45px" }}
      >
        <TableContainer
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: 1100,
              lg: 1100,
              xl: "none",
            },
          }}
        >
          <Table className="task-table" aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell> {/* Checkbox */}
                <TableCell align="center">STT</TableCell>
                <TableCell align="center" style={{ minWidth: "100px" }}>
                  Chi tiết
                </TableCell>
                <TableCell align="left" style={{ minWidth: "150px" }}>
                  Tên công việc
                </TableCell>
                <TableCell align="left" style={{ minWidth: "150px" }}>
                  Người nhận việc
                </TableCell>
                <TableCell align="center">Bình luận</TableCell>
                <TableCell align="center">Ngày bắt đầu</TableCell>
                <TableCell align="center">Ngày kết thúc</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="left">Link</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listTask.map((task, index) => (
                <TableRow
                  key={task._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <InfoOutlinedIcon onClick={() => onOpenDetail(task._id)} />
                    {idOpenDetail === task._id && (
                      <KabanDetail
                        open={openDetail}
                        handleClose={closeDetail}
                        task={task}
                        // idOpenComment={idOpenComment}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTaskId === task._id ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                        onBlur={(e) => handleBlurOrEnter(e, task)}
                        onKeyDown={(e) => handleBlurOrEnter(e, task)}
                      />
                    ) : (
                      <div className="task-name">
                        <img
                          src="image/Pen.png"
                          alt="edit"
                          className="edit-icon"
                          onClick={() => handleEditClick(task._id, task.title)}
                        />
                        <p className="text-truncate">{task.title}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="assignees" align="center">
                    <div className="task-icons1">
                      {task.assigneeId?.slice(0, 2).map((avatar, i) => (
                        <Avatar src={avatar} key={i} />
                      ))}
                      {task.assigneeId.length > 2 && (
                        <>
                          <img
                            src="image/dot.png"
                            onClick={(e) => handleClickMemberTask(e, task._id)}
                          />
                          {selectedTaskId === task._id && (
                            <Popover
                              open={Boolean(anchorElMemberTask)}
                              anchorEl={anchorElMemberTask}
                              onClose={handleCloseMemberTask}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              sx={{ mt: 1 }}
                            >
                              <div className="all-member-in-task">
                                <MemberListContent
                                  members={task.assigneeId}
                                  onClose={handleCloseMemberTask}
                                />
                              </div>
                            </Popover>
                          )}
                        </>
                      )}
                      <button
                        className="add-user"
                        onClick={(e) => handleClickMemberAdd(e, task._id)}
                      >
                        +
                      </button>
                    </div>
                    {selectedTaskId === task._id && (
                      <Popover
                        open={Boolean(anchorElMemberAdd)}
                        anchorEl={anchorElMemberAdd}
                        onClose={handleCloseMemberAdd}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        sx={{ mt: 1 }}
                      >
                        <MemberListContentAdd
                          onClose={handleCloseMemberAdd}
                          idProject={idProject}
                          task={task}
                          fetchApi={dispatch(
                            getListTaskByProjectIdRedux(idProject)
                          )}
                          toast={toast}
                        />
                      </Popover>
                    )}
                  </TableCell>
                  <TableCell
                    className="comment-cell"
                    align="center"
                    style={{ minWidth: "100px" }}
                  >
                    <img
                      src="image/Chat_.png"
                      alt="comments"
                      className="comment-icon"
                      onClick={() => onOpenComment(task._id)}
                    />
                    {idOpenComment === task._id && (
                      <CommentModal
                        open={openComment}
                        handleClose={closeComment}
                        task={task}
                        // idOpenComment={idOpenComment}
                      />
                    )}
                  </TableCell>
                  <TableCell className="comment-cell" align="center">
                    {editingDateTaskId === task._id ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            // value={task.startDate}
                            onChange={async (newValue) => {
                              if (new Date(task.endDate) < newValue) {
                                toast.error(
                                  "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
                                  {
                                    autoClose: 3000,
                                  }
                                );
                              } else {
                                try {
                                  const response = await updateIssueData(
                                    task._id,
                                    {
                                      ...task,
                                      startDate: newValue,
                                    }
                                  );
                                  if (
                                    response.message ===
                                    "Nhiệm vụ cập nhật thành công"
                                  ) {
                                    dispatch(
                                      getListTaskByProjectIdRedux(idProject)
                                    );

                                    toast.success(response.message, {
                                      autoClose: 3000,
                                    });
                                  } else {
                                    toast.error(response.message, {
                                      autoClose: 3000,
                                    });
                                  }
                                } catch (error) {
                                  console.error(
                                    "Lỗi khi cập nhật task:",
                                    error
                                  );
                                }
                              }

                              setEditStartDate("startDate", newValue);
                              setEditingDateTaskId(false);
                            }}
                            format="DD/MM/YYYY"
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    ) : (
                      <div className="date-cell">
                        {dayjs(task.startDate).format("DD/MM/YYYY")}
                        <img
                          src="image/Vector.png"
                          alt="start-date"
                          className="calendar-icon"
                          onClick={() =>
                            handleEditStartDate(task._id, task.startDate)
                          }
                        />
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="comment-cell">
                    {editingDateEndTaskId === task._id ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            // value={task.startDate}
                            onChange={async (newValue) => {
                              if (new Date(task.startDate) > newValue) {
                                toast.error(
                                  "Ngày kết thúc phải lớn hơn ngày bắt đầu",
                                  {
                                    autoClose: 3000,
                                  }
                                );
                              } else {
                                try {
                                  const response = await updateIssueData(
                                    task._id,
                                    {
                                      ...task,
                                      endDate: newValue,
                                    }
                                  );
                                  if (
                                    response.message ===
                                    "Nhiệm vụ cập nhật thành công"
                                  ) {
                                    dispatch(
                                      getListTaskByProjectIdRedux(idProject)
                                    );

                                    toast.success(response.message, {
                                      autoClose: 3000,
                                    });
                                  } else {
                                    toast.error(response.message, {
                                      autoClose: 3000,
                                    });
                                  }
                                } catch (error) {
                                  console.error(
                                    "Lỗi khi cập nhật task:",
                                    error
                                  );
                                }
                              }

                              setEditEndDate("endDate", newValue);
                              setEditingDateEndTaskId(false);
                            }}
                            format="DD/MM/YYYY"
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    ) : (
                      <div className="date-cell">
                        {dayjs(task.endDate).format("DD/MM/YYYY")}
                        <img
                          src="image/Vector.png"
                          alt="start-date"
                          className="calendar-icon"
                          onClick={() =>
                            handleEditEndDate(task._id, task.endDate)
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="status-cell">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Công việc mới</option>
                      <option value="in progress">Đang thực hiện</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="done">Kết thúc</option>
                    </select>
                  </TableCell>
                  <TableCell style={{ minWidth: "250px" }}>
                    {editingLinkTaskId === task._id ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        value={editedTaskLink}
                        onChange={(e) => setEditedTaskLink(e.target.value)}
                        onBlur={(e) => handleBlurOrEnterLink(e, task)}
                        onKeyDown={(e) => handleBlurOrEnterLink(e, task)}
                      />
                    ) : (
                      <div className="date-cell">
                        <a
                          href={task.link}
                          target="_blank"
                          style={{ color: "#000", marginRight: "5px" }}
                          className="text-truncate"
                        >
                          {task.link}
                        </a>
                        <LinkIcon
                          onClick={() =>
                            handleEditClickLink(task._id, task.link)
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => editModalOpen(task._id)}>
                      <EditNoteIcon />
                    </Button>
                    {idEditModal === task._id && (
                      <EditForm
                        isOpen={editModal}
                        onClose={editModalClose}
                        task={task}
                        idProject={idProject}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
