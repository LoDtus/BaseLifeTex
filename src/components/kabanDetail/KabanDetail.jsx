import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./KabanDetail.scss";
import style from "../IssueFrom/IssueForm.module.scss";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { toast, ToastContainer } from "react-toastify";

const KabanDetail = ({ open, handleClose }) => {
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
    issueName: "Bug Header",
    description: "Text is not visible",
    link: "LifeTex.com.vn",
    imageFile: "",
    personName: [],
    report: {
      name: 'Tucker',
      avatar: 'https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png',
    },
    startDate: null,
    endDate: null,
    status: "",
  };

  const errorsDefault = {
    issueName: false,
    description: false,
    link: false,
    personName: false,
    startDate: false,
    endDate: false,
    status: false,
  };

  const [data, setData] = useState(dataDefault);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(listComment);
  const [user, setUsers] = useState(listUser);
  const [errorData, setErrorData] = useState(errorsDefault);

  const handleChangeInput = (type, value) => {
    setData((prev) => ({
      ...prev,
      [type]: value,
    }));
    setErrorData({...errorData,[type]:false});
  };

  const handleChangeSelect = (value) => {
    const uniqueArr = value.filter(
      (num) => value.indexOf(num) === value.lastIndexOf(num)
    );
    setData({ ...data, personName: uniqueArr });
  };

  const handleBlurChange = (type,value) => {
    if(type) {
      if(value) {
        console.log(data);
        setErrorData({...errorData,[type]:false});
      }
      else {
        setErrorData({...errorData,[type]:true});
        toast.error(`${type} không được để trống!`);
      }
    }
  };

  const handleAddComment = () => {
    // if (comment.trim()) {
    //   const newComment = {
    //     id: Math.random().toString(36).substr(2, 9),
    //     commentBy: "Tucker",
    //     text: comment,
    //   };
    //   setComments((prev) => [...prev, newComment]);
    //   setComment("");
    // }
    console.log(data)
  };

  return (
    <>
    <Modal
      open={true}
      style={{ border: "none", outline: "none" }}
      onClose={handleClose}
      className="modal-container"
    >
      <Box className="kaban-detail">
        <div className="kaban-detail-header">
          <p>
            <EventAvailableIcon /> kan-1
          </p>
          <button className="close-btn" onClick={handleClose}>
            ✖
          </button>
        </div>
        <div className="content">
          <div className="kaban-content">
            <div className="kaban-content-text">
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                multiline
                error={errorData.issueName}
                placeholder="Nhập vấn đề..."
                value={data.issueName}
                onBlur={(e)=>handleBlurChange('issueName',e.target.value)}
                onChange={(e) => handleChangeInput("issueName", e.target.value)}
                className="kaban-content-text-edit"
              />
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                multiline
                minRows={6}
                maxRows={10}
                sx={{ marginTop: "8px" }}
                placeholder="Nhập nội dung..."
                value={data.description}
                error={errorData.description}
                onBlur={(e)=>handleBlurChange('description',e.target.value)}
                onChange={(e) =>
                  handleChangeInput("description", e.target.value)
                }
                className="kaban-content-text-edit"
              />
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
              <div className="kaban-description-personName-edit">
                <FormControl sx={{ width: "100%", overflow: "hidden" }}>
                  <Select
                    size="small"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={data.personName}
                    error={errorData.personName}
                    onChange={(e) => handleChangeSelect(e.target.value)}
                    renderValue={(selected) => {
                      const maxVisible = 4; 
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {selected.slice(0, maxVisible).map((name, index) => (
                            <img
                              key={index}
                              src={name.avatar}
                              alt=""
                              style={{
                                width: "23px",
                                height: "23px",
                                borderRadius: "50%",
                              }}
                            />
                          ))}
                          {selected.length > maxVisible && (
                            <span
                            style={{
                              overflow: "hidden",
                              backgroundColor: "transparent",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#333",
                              border: "2px solid #333",
                              textAlign: "center",
                              width: "23px",
                              height: "23px",
                            }}
                            >
                              <MoreHorizIcon/>
                            </span>
                          )}
                        </div>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          overflowY: "auto",
                        },
                      },
                    }}
                  >
                    {user.map((item) => (
                      <MenuItem key={item.id} value={item}>
                        <div className={style.wrapItemSlc}>
                          <img
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                            }}
                            className={style.avatar}
                            src={item.avatar}
                            alt="avatar"
                          />
                          <div className={style.name}>{item.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="kaban-description">
              <p>Link:</p>
              <div className="kaban-description-link-edit">
                <TextField
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  error={errorData.link}
                  placeholder="Nhập link..."
                  value={data.link}
                  onChange={(e) => handleChangeInput("link", e.target.value)}
                />
              </div>
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
                <FormControl>
                  <Select
                    size="small"
                    error={errorData.status}
                    value={data.status}
                    onChange={(e) =>
                      handleChangeInput("status", e.target.value)
                    }
                    sx={{
                      width: "100%",
                      height: 40,
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Trạng thái</em>
                    </MenuItem>
                    <MenuItem value={0}>Công việc mới</MenuItem>
                    <MenuItem value={1}>Đang thực hiện</MenuItem>
                    <MenuItem value={2}>Hoàn thành</MenuItem>
                    <MenuItem value={3}>Kết thúc</MenuItem>
                    <MenuItem value={4}>Tạm dừng</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="kaban-description">
              <p>Ngày bắt đầu:</p>
              <div className="kaban-description-date">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="startDate"
                    error={errorData.startDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          height: "40px",
                          "& .MuiInputBase-root": { height: "40px" },
                        },
                      },
                    }}
                    value={data.startDate}
                    onChange={(value) =>
                      handleChangeInput("startDate", value)
                    }
                    size="small"
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="kaban-description">
              <p>Ngày kết thúc:</p>
              <div className="kaban-description-date">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="endDate"
                    error={errorData.endDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          height: "40px",
                          "& .MuiInputBase-root": { height: "40px" },
                        },
                      },
                    }}
                    value={data.endDate}
                    onChange={(value) =>
                      handleChangeInput("endDate",value)
                    }
                    size="small"
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="kaban-description">
              <p>Người báo cáo:</p>
              <div className="kaban-single-info">
                <img src={data.report.avatar} alt="" />
                <p>
                  {data.report.name}
                </p>
              </div>
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

export default KabanDetail;
