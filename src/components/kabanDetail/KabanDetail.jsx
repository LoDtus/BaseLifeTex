import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  Avatar,
  Typography,
} from "@mui/material";
import "./KabanDetail.scss";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast } from "react-toastify";
import { cvDate } from "../../tools/tools.CvDateKaban";
import { useForm, Controller } from "react-hook-form";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import imageAvatar from "../../assets/image/image_5.png";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const KabanDetail = ({ open, task, handleClose }) => {
  const { control } = useForm();

  const errorsDefault = {
    title: false,
    description: false,
    link: false,
    assigneeId: false,
    startDate: false,
    endDate: false,
    status: false,
  };

  const errorMessages = {
    title: "Tên vấn đề không được để trống!",
    description: "Mô tả không được để trống!",
    link: "Link không được để trống!",
    assigneeId: "Tên người không được để trống!",
    startDate: "Ngày bắt đầu không được để trống!",
    endDate: "Ngày kết thúc không được để trống!",
    status: "Trạng thái không được để trống!",
    startDateInvalid: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc!",
    endDateInvalid: "Ngày kết thúc phải lớn hơn ngày bắt đầu!",
  };

  const [data, setData] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [errorData, setErrorData] = useState(errorsDefault);
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [listMember, setListMember] = useState([]);
  const token = "jhgshddabjsbbdak";

  const getMemberByProject = async () => {
      const response = await getlistUser(token, data.projectId);
      if (response.members) {
        setListMember(response.members);
      }
    };

  useEffect(()=>{
    getMemberByProject()
  },[])  

  useEffect(() => {
    if (task !== null) {
      console.log("Task data:", task);
      setData({
        ...task,
      });
      setSelectedPerson(task.assigneeId);
    }
  }, [task]);

  const handleChangeInput = (type, value) => {
    setData((prev) => ({
      ...prev,
      [type]: value,
    }));
    setErrorData({ ...errorData, [type]: false });
  };

  const handleBlurChange = async (type, value) => {
    if (type) {
      if (type === "assigneeId") {
        if (value && value.length > 0) {
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            [type]: false,
          }));
        } else {
          setErrorData((prevErrorData) => ({ ...prevErrorData, [type]: true }));
          toast.error(errorMessages[type]);
        }
      } else if (type === "startDate" || type === "endDate") {
        const startDate = cvDate(data.startDate);
        const endDate = cvDate(data.endDate);
        if (startDate === null || startDate === "") {
          setErrorData((prevErrorData) => ({ ...prevErrorData, [type]: true }));
          toast.error(errorMessages[type]);
        }
        if (endDate === null || endDate === "") {
          setErrorData((prevErrorData) => ({ ...prevErrorData, [type]: true }));
          toast.error(errorMessages[type]);
        }
        if (startDate > endDate) {
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            startDate: true,
          }));
          toast.error(errorMessages.startDateInvalid);
          return;
        }
        if (endDate < startDate) {
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            endDate: true,
          }));
          toast.error(errorMessages.endDateInvalid);
          return;
        }
        setErrorData((prevErrorData) => ({
          ...prevErrorData,
          [type]: false,
        }));
      } else {
        if (value) {
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            [type]: false,
          }));
        } else {
          setErrorData((prevErrorData) => ({ ...prevErrorData, [type]: true }));
          toast.error(errorMessages[type]);
        }
      }
    }
  };

  const handleAddComment = () => {
    console.log(data);
    console.log(selectedPerson);
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
                  minRows={1}
                  maxRows={1}
                  error={errorData.title}
                  placeholder="Nhập vấn đề..."
                  value={data?.title}
                  onBlur={() => handleBlurChange("title", data?.title)}
                  onChange={(e) => handleChangeInput("title", e.target.value)}
                  className="kaban-content-text-edit"
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  minRows={10}
                  maxRows={20}
                  sx={{ marginTop: "8px" }}
                  placeholder="Nhập nội dung..."
                  value={data?.description}
                  error={errorData.description}
                  onBlur={() =>
                    handleBlurChange("description", data?.description)
                  }
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
                  {comments.length > 0 &&
                    comments.map((cmt) => (
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
                  <FormControl
                    fullWidth
                    size="small"
                    error={errorData.assigneeId}
                  >
                    <Controller
                      name="assigneeId"
                      control={control}
                      rules={{
                        required: "Vui lòng chọn ít nhất một người nhận việc",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={field.value || []}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          renderValue={(selected) =>
                            selected
                              .map(
                                (id) =>
                                  listMember.find((person) => person._id === id)
                                    ?.userName
                              )
                              .join(", ")
                          }
                          MenuProps={MenuProps}
                          sx={{
                            mb: 1,
                          }}
                          defaultValue={task?.assigneeId.map((i) => i._id)}
                        >
                          {listMember.map((person) => (
                            <MenuItem key={person._id} value={person._id}>
                              <Checkbox
                                checked={
                                  field.value?.includes(person._id) || false
                                }
                              />
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                  ml: 4,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: "purple",
                                    width: 40,
                                    height: 40,
                                    marginRight: 2,
                                  }}
                                  src="image\\f8ad738c648cb0c7cc815d6ceda805b0.png"
                                ></Avatar>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    width: "200px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {person.userName}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errorData.assigneeId && (
                      <Typography
                        variant="span"
                        sx={{
                          color: "red",
                          fontSize: "small",
                        }}
                      >
                        Vui lòng chọn ít nhất một người nhận việc
                      </Typography>
                    )}
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
                    minRows={1}
                    maxRows={1}
                    error={errorData.link}
                    placeholder="Nhập link..."
                    value={data?.link}
                    onChange={(e) => handleChangeInput("link", e.target.value)}
                    onBlur={() => handleBlurChange("link", data?.link)}
                  />
                </div>
              </div>
              <div className="kaban-description image">
                <p>Hình ảnh:</p>
                <p className="kaban-descrition-image">
                  <Zoom>
                    <img
                      src={
                        data?.image ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKCI0jyuDli7hTwPGh90HItM5yF-HOF_pzrQ&s"
                      }
                      alt="image"
                    />
                  </Zoom>
                </p>
              </div>
              <div className="kaban-description">
                <p>Trạng thái:</p>
                <div className="kaban-single-info">
                  <FormControl>
                    <Select
                      size="small"
                      error={errorData.status}
                      value={data?.status || ""}
                      onChange={(e) =>
                        handleChangeInput("status", e.target.value)
                      }
                      onBlur={() => handleBlurChange("status", data?.status)}
                      sx={{
                        width: "100%",
                        height: 40,
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Trạng thái</em>
                      </MenuItem>
                      <MenuItem value="pending">Công việc mới</MenuItem>
                      <MenuItem value="todo">Đang thực hiện</MenuItem>
                      <MenuItem value="inProgress">Chưa hoàn thành</MenuItem>
                      <MenuItem value="completed">Hoàn thành</MenuItem>
                      <MenuItem value="done">Kết thúc</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="kaban-description">
                <p>Ngày bắt đầu:</p>
                <div className="kaban-description-date">
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    size="small"
                    error={errorData.startDate}
                    value={cvDate(data?.startDate)}
                    onChange={(e) =>
                      handleChangeInput("startDate", e.target.value)
                    }
                    onBlur={() =>
                      handleBlurChange("startDate", data?.startDate)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mb: 2 }}
                  />
                </div>
              </div>
              <div className="kaban-description">
                <p>Ngày kết thúc:</p>
                <div className="kaban-description-date">
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    size="small"
                    error={errorData.endDate}
                    value={cvDate(data?.endDate)}
                    onChange={(e) =>
                      handleChangeInput("endDate", e.target.value)
                    }
                    onBlur={() => handleBlurChange("endDate", data?.endDate)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mb: 2 }}
                  />
                </div>
              </div>
              <div className="kaban-description">
                <p>Người báo cáo:</p>
                {data?.assignerId && (
                  <div className="kaban-single-info">
                    <img src={imageAvatar} alt="" />
                    <p>{data?.assignerId && data?.assignerId.userName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default KabanDetail;
