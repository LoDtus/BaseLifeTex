import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Backdrop } from "@mui/material";
import {
  getPaginateCommentByTask,
  addCommentTask,
} from "../../services/commentService";
import "./CommentModal.scss";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const CommentModal = ({ open, handleClose, task }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);

  const handleAddComment = async () => {
    if (user && user.data) {
      if (comment) {
        let res = await addCommentTask({
          taskId: task._id,
          content: comment,
        });
        if (res && res.success === true) {
          setComment("");
        } else {
          toast.error(res.message);
          setComment("");
        }
      } else {
        toast.error("Comment không được để trống");
      }
    } else {
      toast.warning("Đăng nhập để thực hiện yêu cầu này!");
    }
    getPaginateComment(task._id, page, limit);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const getPaginateComment = async (id, page, limit) => {
    if (user) {
      let response = await getPaginateCommentByTask(id, page, limit);
      if (response && response.success === true) {
        setComments(response.data);
        setTotalPage(response.totalPage);
        setPage(response.page);
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    if (task) {
      getPaginateComment(task._id, page, limit);
    }
  }, [task, page, limit]);

  return (
    <>
      <Modal
        open={open}
        style={{ border: "none", outline: "none" }}
        onClose={handleClose}
        className="modal-container"
      >
        <Box className="comment-modal">
          <div className="kaban-detail-header">
            <p>
              <EventAvailableIcon /> Việc 1
            </p>
            <button className="close-btn" onClick={handleClose}>
              ✖
            </button>
          </div>
          <div className="content">
            <div className="kaban-content">
              <div className="kaban-content-text">
                <p className="name-task">{task?.title}</p>
                <p className="desc-task">{task?.description}</p>
              </div>
              <div className="comment-section">
                <h4>Bình luận</h4>
                <div className="comment-box">
                  <img
                    src="https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"
                    alt="user"
                    className="avatar"
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Nhập bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="comment-input"
                  />
                </div>
                <div className="comment-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                  >
                    Gửi
                  </Button>
                  <Button variant="contained" className="cancel-btn">
                    Hủy
                  </Button>
                </div>
                <div
                  className={user ? "comment-list fix-height" : "comment-list"}
                >
                  {comments &&
                    comments.length > 0 &&
                    comments.map((cmt) => (
                      <div key={cmt._id} className="comment">
                        <img
                          src={
                            cmt.userId.avatar ||
                            "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"
                          }
                          alt="user"
                          className="avatar"
                        />
                        <div className="cmt-text">
                          <p>{cmt.userId.userName}</p>
                          <p>{cmt.content}</p>
                        </div>
                      </div>
                    ))}
                  {totalPage > 1 && (
                    <Stack spacing={2} sx={{ textAlign: "center" }}>
                      <Pagination
                        count={totalPage}
                        page={page}
                        onChange={handleChange}
                      />
                    </Stack>
                  )}
                </div>
              </div>
            </div>
            <div className="kaban-info">
              <div className="kaban-description image">
                <p>Hình ảnh:</p>
                <img
                  // src="https://res.cloudinary.com/dvmpaqgtv/image/upload/v1742269884/Screenshot_2023-11-01_112242_c7zh0g.png"
                  src={task.image}
                  alt=""
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default CommentModal;
