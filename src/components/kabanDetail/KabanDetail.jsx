import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import "./KabanDetail.scss";

const KabanDetail = ({ open, handleClose }) => {
  const editCheckDefault = {
    editHeader: false,
    editLink: false,
  };

  const onCheckEdit = (type) => {
    switch (type) {
      case "editHeader":
        setEditCheck({ ...editCheck, editHeader: true });
        break;
      case "editLink":
        setEditCheck({ ...editCheck, editLink: true });
        break;
    }
  };

  const handleChangeInput = (type, value) => {
    setData((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleBlurChange = (type) => {
    switch (type) {
      case "editHeader":
        setEditCheck({ ...editCheck, editHeader: false });
        break;
      case "editLink":
        setEditCheck({ ...editCheck, editLink: false });
        break;
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        commentBy: "Nguyen Van A",
        text: comment,
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");
    }
  };

  const [editCheck, setEditCheck] = useState(editCheckDefault);

  const listUser = [
    {
      id: "abc",
      name: "Nguyen Van A",
      avatar:
        "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png",
    },
    {
      id: "efd",
      name: "Le Van B",
      avatar:
        "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png",
    },
    {
      id: "hgj",
      name: "Tran Van C",
      avatar:
        "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png",
    },
    {
      id: "wer",
      name: "Do Van D",
      avatar:
        "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png",
    },
  ];

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

  const dataDefault = {
    header: "",
    link: "",
  };

  const [data, setData] = useState(dataDefault);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(listComment);
  const [user, setUsers] = useState(listUser);

  return (
    <Modal
      open={true}
      style={{ border: "none", outline: "none" }}
      onClose={handleClose}
      className="modal-container"
    >
      <Box className="kaban-detail">
        <div className="kaban-detail-header">
          <p>kan-1</p>
          <button className="close-btn" onClick={handleClose}>
            ✖
          </button>
        </div>
        <div className="content">
          <div className="kaban-content">
            <div className="kaban-content-text">
              {editCheck.editHeader === true ? (
                <input
                  value={data.header}
                  onFocus={()=>handleChangeInput("Editheader")}
                  onBlur={() => handleBlurChange("editHeader")}
                  onChange={(e) => handleChangeInput("header", e.target.value)}
                  className="kaban-content-text-edit"
                />
              ) : (
                <h3 onClick={() => onCheckEdit("editHeader")}>
                  {" "}
                  {data.header || "Fix Header"}
                </h3>
              )}
              <p>Đây là lỗi giao diện...</p>
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
            <h4>Thông tin chi tiết</h4>
            <div className="kaban-description">
              <p>Người nhận việc:</p>
              {user && user.length > 1 ? (
                <div className="kaban-multi-info">
                  {user.slice(0, 5).map((item, index) => {
                    return <img src={item.avatar} key={index} />;
                  })}
                  <span className="more">...</span>
                </div>
              ) : (
                <div className="kaban-single-info">
                  <img src={user[0].avatar} alt="" />
                  <p>
                    {user[0].name} <span>icon</span>
                  </p>
                </div>
              )}
            </div>
            <div className="kaban-description">
              <p>Link:</p>
              {editCheck.editLink ? (
                <input
                  value={data.link}
                  onBlur={() => handleBlurChange("editLink")}
                  onChange={(e) => handleChangeInput("link", e.target.value)}
                  className="kaban-description-edit"
                />
              ) : (
                <p
                  onClick={() => onCheckEdit("editLink")}
                  className="kaban-description-link"
                >
                  {data.link || "https://lifetek.vn"}
                </p>
              )}
            </div>
            <div className="kaban-description image">
              <p>Hình ảnh:</p>
              <p className="kaban-descrition-image">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIpV5CA8mgHMPImfa2IWGky1_7N6zcesgnaA&s"
                  alt=""
                />
              </p>
            </div>
            <div className="kaban-description">
              <p>Trạng thái:</p>
              <div className="kaban-single-info">
                <p>
                  Công việc mới <span>icon</span>
                </p>
              </div>
            </div>
            <div className="kaban-description">
              <p>Ngày bắt đầu:</p>
              <p className="kaban-description-date">
                <span className="icon">📅</span> 05/03/2025
              </p>
            </div>
            <div className="kaban-description">
              <p>Ngày kết thúc:</p>
              <p className="kaban-description-date">
                <span className="icon">📅</span> 06/03/2025
              </p>
            </div>
            <div className="kaban-description">
              <p>Người báo cáo:</p>
              <div className="kaban-single-info">
                <img src={user[0].avatar} alt="" />
                <p>
                  {user[0].name} <span>icon</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default KabanDetail;
