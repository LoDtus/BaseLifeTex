import React, { useState } from "react";
import { Modal, Box, TextField, Button, Backdrop } from "@mui/material";
import "./CommentModal.scss";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast, ToastContainer } from "react-toastify";

const CommentModal = ({ open, handleClose, task }) => {
  const listComment = [
    {
      id: "anb",
      commentBy: "Tran Van C",
      text: "Lỗi undefinde dòng 8",
    },
    {
      id: "klj",
      commentBy: "Nguyen Van A",
      text: "Lỗi thiếu function",
    },
  ];

  //   const errorsDefault = {
  //     issueName: false,
  //     description: false,
  //     link: false,
  //     personName: false,
  //     startDate: false,
  //     endDate: false,
  //     status: false,
  //   };

  //   const errorMessages = {
  //     issueName: "Tên vấn đề không được để trống!",
  //     description: "Mô tả không được để trống!",
  //     link: "Link không được để trống!",
  //     personName: "Tên người không được để trống!",
  //     startDate: "Ngày bắt đầu không được để trống!",
  //     endDate: "Ngày kết thúc không được để trống!",
  //     status: "Trạng thái không được để trống!",
  //   };

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(listComment);

  //   const [errorData, setErrorData] = useState(errorsDefault);

  //   const handleBlurChange = async (type, value) => {
  //     if (type) {
  //       if (type === "personName") {
  //         if (value && value.length > 0) {
  //           console.log(data);
  //           setErrorData({ ...errorData, [type]: false });
  //         } else {
  //           setErrorData({ ...errorData, [type]: true });
  //           toast.error(errorMessages[type]);
  //         }
  //       } else if (type === "startDate" || type === "endDate") {
  //         if (value && typeof value.isValid === "function" && value.isValid()) {
  //           console.log(data);
  //           setErrorData({ ...errorData, [type]: false });
  //         } else {
  //           setErrorData({ ...errorData, [type]: true });
  //           toast.error(errorMessages[type]);
  //         }
  //       } else {
  //         if (value || value === 0) {
  //           console.log(data);
  //           setErrorData({ ...errorData, [type]: false });
  //         } else {
  //           setErrorData({ ...errorData, [type]: true });
  //           toast.error(errorMessages[type]);
  //         }
  //       }
  //     }
  //   };

  console.log(task);

  const handleAddComment = () => {
    console.log(task);
  };

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
                    minRows={3}
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
                <div className="comment-list">
                  {comments.map((cmt) => (
                    <div key={cmt.id} className="comment">
                      <img
                        src="https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"
                        alt="user"
                        className="avatar"
                      />
                      <div className="cmt-text">
                        <p>{cmt.commentBy}</p>
                        <p>{cmt.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="kaban-info">
              <div className="kaban-description image">
                <p>Hình ảnh:</p>
                <p className="kaban-descrition-image">
                  <img src={task?.images} alt="" />
                </p>
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
