// src/components/ListHome/ListHome.jsx
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateIssueData, updateIssueDataStatus } from "../../apis/Issue";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Input, Avatar, Button, Popover } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import KabanDetail from "../../components/kabanDetail/KabanDetail";
import CommentModal from "../../components/commentModal/CommentModal";
import MemberListContent from "../../components/memberList/MemberList";
import MemberListContentAdd from "../../components/memberListAdd/MemberListAdd";
import EditForm from "../../components/editForm/EditForm";
import "./ListHome.scss";
import TablePagination from '@mui/material/TablePagination';

const ListHome = () => {
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const { listTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListTaskByProjectIdRedux(idProject));
  }, [idProject, dispatch]);

  const inputRef = useRef(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingLinkTaskId, setEditingLinkTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [editedTaskLink, setEditedTaskLink] = useState("");
  const [anchorElMemberTask, setAnchorElMemberTask] = useState(null);
  const [anchorElMemberAdd, setAnchorElMemberAdd] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [idOpenDetail, setIdOpenDetail] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [idOpenComment, setIdOpenComment] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [idEditModal, setIdEditModal] = useState(null);

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleClickMemberTask = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId);
    setAnchorElMemberTask(event.currentTarget);
  };

  const handleCloseMemberTask = () => {
    setAnchorElMemberTask(null);
    setSelectedTaskId(null);
  };

  const handleClickMemberAdd = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId);
    setAnchorElMemberAdd(event.currentTarget);
  };

  const handleCloseMemberAdd = () => {
    setAnchorElMemberAdd(null);
    setSelectedTaskId(null);
  };

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
    <div className="list-home-wrapper">
      <ToastContainer />
      <Paper className="table-paper" sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer className="table-container">
          <Table className="task-table" aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell"></TableCell> {/* Checkbox */}
                <TableCell className="table-header-cell" align="center">STT</TableCell>
                <TableCell className="table-header-cell" align="center" style={{ minWidth: "100px" }}>Chi tiết</TableCell>
                <TableCell className="table-header-cell" align="left" style={{ minWidth: "150px" }}>Tên công việc</TableCell>
                <TableCell className="table-header-cell" align="left" style={{ minWidth: "150px" }}>Người nhận việc</TableCell>
                <TableCell className="table-header-cell" align="center">Bình luận</TableCell>
                <TableCell className="table-header-cell" align="center">Ngày bắt đầu</TableCell>
                <TableCell className="table-header-cell" align="center">Ngày kết thúc</TableCell>
                <TableCell className="table-header-cell" align="center">Trạng thái</TableCell>
                <TableCell className="table-header-cell" align="left" style={{ minWidth: "250px" }}>Link</TableCell>
                <TableCell className="table-header-cell" align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listTask?.map((task, index) => (
                <TableRow
                  key={task._id}
                  className="table-row"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className="table-cell">
                    <input type="checkbox" className="checkbox-input" />
                  </TableCell>
                  <TableCell className="table-cell" align="center">{index + 1}</TableCell>
                  <TableCell className="table-cell" align="center">
                    <InfoOutlinedIcon className="action-icon" onClick={() => onOpenDetail(task._id)} />
                    {idOpenDetail === task._id && (
                      <KabanDetail
                        open={openDetail}
                        handleClose={closeDetail}
                        task={task}
                      />
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    {editingTaskId === task._id ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                        onBlur={(e) => handleBlurOrEnter(e, task)}
                        onKeyDown={(e) => handleBlurOrEnter(e, task)}
                        className="edit-input"
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
                  <TableCell className="table-cell assignees" align="center">
                    <div className="task-icons1">
                      {task.assigneeId?.slice(0, 2).map((avatar, i) => (
                        <Avatar src={avatar} key={i} className="avatar" />
                      ))}
                      {task.assigneeId?.length > 2 && (
                        <>
                          <img
                            src="image/dot.png"
                            className="more-icon"
                            onClick={(e) => handleClickMemberTask(e, task._id)}
                          />
                          <Popover
                            open={Boolean(anchorElMemberTask)}
                            anchorEl={anchorElMemberTask}
                            onClose={handleCloseMemberTask}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                            sx={{ mt: 1 }}
                          >
                            <div className="all-member-in-task">
                              <MemberListContent
                                members={task.assigneeId}
                                onClose={handleCloseMemberTask}
                              />
                            </div>
                          </Popover>
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
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        sx={{ mt: 1 }}
                      >
                        <MemberListContentAdd
                          onClose={handleCloseMemberAdd}
                          idProject={idProject}
                          task={task}
                          fetchApi={() => dispatch(getListTaskByProjectIdRedux(idProject))}
                          toast={toast}
                        />
                      </Popover>
                    )}
                  </TableCell>
                  <TableCell className="table-cell comment-cell" align="center" style={{ minWidth: "100px" }}>
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
                      />
                    )}
                  </TableCell>
                  <TableCell className="table-cell comment-cell" align="center">
                    <div className="date-cell">
                      {dayjs(task.startDate).format("DD/MM/YYYY")}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell comment-cell" align="center">
                    <div className="date-cell">
                      {dayjs(task.endDate).format("DD/MM/YYYY")}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell status-cell">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="status-select"
                    >
                      <option value={0}>Công việc mới</option>
                      <option value={1}>Đang thực hiện</option>
                      <option value={2}>Hoàn thành</option>
                      <option value={3}>Khóa công việc</option>
                    </select>
                  </TableCell>
                  <TableCell className="table-cell">
                    {editingLinkTaskId === task._id ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        value={editedTaskLink}
                        onChange={(e) => setEditedTaskLink(e.target.value)}
                        onBlur={(e) => handleBlurOrEnterLink(e, task)}
                        onKeyDown={(e) => handleBlurOrEnterLink(e, task)}
                        className="edit-input"
                      />
                    ) : (
                      <div className="date-cell">
                        <a
                          href={task.link}
                          target="_blank"
                          className="link-text text-truncate"
                        >
                          {task.link}
                        </a>
                        <LinkIcon
                          className="action-icon"
                          onClick={() => handleEditClickLink(task._id, task.link)}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Button className="edit-button" onClick={() => editModalOpen(task._id)}>
                      <EditNoteIcon className="action-icon" />
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
        <TablePagination
      component="div"
      count={100}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
      </Paper>
    </div>
  );
};

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

export default ListHome;