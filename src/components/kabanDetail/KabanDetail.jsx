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
import { getlistUser } from "../../services/userService";
import { updateIssueData } from "../../apis/Issue";
import { getTaskDetailById } from "../../services/taskService";
import {
  getListCommentByTask,
  addCommentTask,
} from "../../services/commentService";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const KabanDetail = ({ task, handleClose }) => {
  const { control } = useForm();

  const errorsDefault = {
    title: false,
    description: false,
    link: false,
    assigneeId: false,
    startDate: false,
    endDate: false,
    status: false,
    comment: false,
  };

  const readOnlyDefault = {
    title: true,
    description: true,
    link: true,
    assigneeId: true,
    startDate: true,
    endDate: true,
    status: true,
    comment: true,
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
    comment: "Bình luận không được để trống!",
  };

  const [data, setData] = useState();
  const [onlyRead, setOnlyRead] = useState(readOnlyDefault);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [errorData, setErrorData] = useState(errorsDefault);
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [listMember, setListMember] = useState([]);
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const getMemberByProject = async (projectId) => {
    const response = await getlistUser(projectId);
    if (response.success === true) {
      setListMember(response.data && response.data.members);
    }
  };

  const getListComment = async (id) => {
    if(user) {
      let response = await getListCommentByTask(id);
      if (response && response.success === true) {
          setComments(response.data);
          console.log(response.data);
          
      }
      else {
        toast.error(response.message)
      }
    }
  };

  const getDetailtask = async (id) => {
    let res = await getTaskDetailById(id);
    if (res && res.data && res.success === true) {
      setData({...res.data});
      console.log(res.data)
      setSelectedPerson(task.assigneeId);
    } else {
     toast.error(res.message);
    }
  };

  useEffect(() => {
    if (task) {
      getMemberByProject(task.projectId);
      getDetailtask(task._id);
      getListComment(task._id);
    }
  }, [task]);

  const handleChangeInput = (type, value) => {
    setData((prev) => ({
      ...prev,
      [type]: value,
    }));
    setErrorData({ ...errorData, [type]: false });
  };
  let isOne = true;

  const handleBlurChange = async (type, value, event) => {
    if (user) {
      if (event.type === "keydown" && event.key !== "Enter") return;
      let check = validateField(type, value);
      if (check === true) {
        let res = await updateIssueData(task._id, {
          ...data,
          assigneeId: data.assigneeId.map((i) => i._id),
          assignerId: data?.assignerId?._id,
          [type]: value,
        });
        console.log("Update",res)
        if (res) {
          toast.error(res.message);
          setData({});
          setErrorData(errorsDefault);
          getDetailtask(task._id);
          setOnlyRead(readOnlyDefault);
        } else {
          toast.success(res.message);
          setData({});
          setErrorData(errorsDefault);
          getDetailtask(task._id);
          setOnlyRead(readOnlyDefault);
          dispatch(getListTaskByProjectIdRedux(task.projectId));
        }
      } else {
        setTimeout(() => {
          setData({});
          setOnlyRead(readOnlyDefault);
          getDetailtask(task._id);
          setErrorData(errorsDefault);
        }, 3000);
      }
    } else {
      event.preventDefault();
    }
  };

  const handleFocus = (type) => {
    if (user || type === "comment") {
      setOnlyRead((prevState) => ({ ...prevState, [type]: false }));
    } else {
      toast.warning("Bạn không có quyền sửa!");
    }
  };

  const validateField = (type, value) => {
    switch (type) {
      case "assigneeId":
        if (!value || value.length === 0) {
          toast.error(errorMessages.assigneeId);
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            assigneeId: true,
          }));
          return false;
        }
        break;
      case "startDate":
      case "endDate":
        const startDate = cvDate(data.startDate);
        const endDate = cvDate(data.endDate);

        if (!startDate || startDate === "") {
          toast.error(errorMessages.startDate);
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            startDate: true,
          }));
          return false;
        }

        if (!endDate || endDate === "") {
          toast.error(errorMessages.endDate);
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            endDate: true,
          }));
          return false;
        }

        if (startDate > endDate) {
          toast.error(errorMessages.startDateInvalid);
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            startDate: true,
          }));
          return false;
        }

        if (endDate < startDate) {
          toast.error(errorMessages.endDateInvalid);
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            endDate: true,
          }));
          return false;
        }
        break;
      default:
        if (!value) {
          toast.error(errorMessages[type]);
          setErrorData((prevErrorData) => ({ ...prevErrorData, [type]: true }));
          return false;
        }
        break;
    }
    return true;
  };

  const handleSelectAssigneeId = (event, field) => {
    if (user) {
      const selectedValues = event.target.value;
      setSelectedPerson(
        listMember.filter((person) => selectedValues.includes(person._id))
      );
      if (selectedValues.length === 0) {
        setErrorData((prevErrorData) => ({
          ...prevErrorData,
          assigneeId: true,
        }));
        toast.error(errorMessages["assigneeId"]);
      } else {
        setErrorData((prevErrorData) => ({
          ...prevErrorData,
          assigneeId: false,
        }));
      }
      field.onChange(selectedValues);
    } else {
      toast.warning("Bạn không có quyền sửa!");
    }
  };

  const handleSelectAssigneeIdBlur = async (type,value, e) => {
    if (user) {
      let check = validateField("assigneeId", value);
      if (check === true) {
        let res = await updateIssueData(task._id, {
          ...data,
          assigneeId: selectedPerson.map((i) => i._id),
          assignerId: data?.assignerId?._id,
          [type]: value,
        });
        if (res.message === "Nhiệm vụ cập nhật thành công") {
          toast.success(res.message);
          setData({});
          setErrorData(errorsDefault);
          getDetailtask(task._id);
          setOnlyRead(readOnlyDefault);
        } else {
          toast.error(res.message);
          setData({});
          setErrorData(errorsDefault);
          getDetailtask(task._id);
          setOnlyRead(readOnlyDefault);
        }
      } else {
        setTimeout(() => {
          setData({});
          setOnlyRead(readOnlyDefault);
          getDetailtask(task._id);
          setErrorData(errorsDefault);
        }, 3000);
      }
    } else {
      e.preventDefault();
    }
  };

  const handleAddComment = async () => {
    if (user && user.data) {
      if (comment) {
        let res = await addCommentTask({
          taskId: data._id,
          content: comment,
        });
        console.log("Check cmt",res)
        if (res) {
          toast.success(res.message);
          setOnlyRead(readOnlyDefault);
          setComment("");
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            comment: false,
          }));
        } else {
          toast.error(res.message);
          setOnlyRead(readOnlyDefault);
          setComment("");
          setErrorData((prevErrorData) => ({
            ...prevErrorData,
            comment: false,
          }));
        }
      } else {
        setErrorData((prevErrorData) => ({ ...prevErrorData, comment: true }));
        toast.error(errorMessages["comment"]);
      }
    } else {
      toast.warning("Đăng nhập để thực hiện yêu cầu này!");
    }
    getListComment(task._id);
  };

  const handleKeyDown = () => {
    if (event.key === "Enter") {
      handleAddComment();
      setOnlyRead(readOnlyDefault);
    }
  };

  const handleCancel = () => {
    setComment("");
    setOnlyRead(readOnlyDefault);
    setErrorData(errorsDefault);
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
                  onFocus={() => handleFocus("title")}
                  onBlur={(e) => handleBlurChange("title", data?.title, e)}
                  onChange={(e) => handleChangeInput("title", e.target.value)}
                  className="kaban-content-text-edit"
                  InputProps={{
                    readOnly: onlyRead.title,
                  }}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  sx={{ marginTop: "8px" }}
                  placeholder="Nhập nội dung..."
                  value={data?.description}
                  error={errorData.description}
                  onFocus={() => handleFocus("description")}
                  onBlur={(e) =>
                    handleBlurChange("description", data?.description, e)
                  }
                  onChange={(e) =>
                    handleChangeInput("description", e.target.value)
                  }
                  InputProps={{
                    readOnly: onlyRead.description,
                  }}
                  className="kaban-content-text-edit"
                />
              </div>
              <div className="comment-section">
                <h4>Bình luận</h4>
                {user && user.data && (
                  <>
                    <div className="comment-box">
                      <img
                        src={user.data.image || imageAvatar}
                        alt="user"
                        className="avatar"
                      />
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        error={errorData.comment}
                        minRows={3}
                        placeholder="Nhập bình luận..."
                        value={comment}
                        onKeyDown={() => handleKeyDown()}
                        onFocus={() => handleFocus("comment")}
                        onChange={(e) => {
                          setComment(e.target.value);
                          setErrorData((prevErrorData) => ({
                            ...prevErrorData,
                            comment: false,
                          }));
                        }}
                        InputProps={{
                          readOnly: onlyRead.comment,
                        }}
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
                      <Button
                        onClick={handleCancel}
                        variant="contained"
                        className="cancel-btn"
                      >
                        Hủy
                      </Button>
                    </div>
                  </>
                )}
                <div
                  className={user ? "comment-list fix-height" : "comment-list"}
                >
                  {comments &&
                    comments.length > 0 &&
                    comments.map((cmt) => (
                      <div key={cmt._id} className="comment">
                        <img
                          src={cmt.userId.avatar || "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"}
                          alt="user"
                          className="avatar"
                        />
                        <div className="cmt-text">
                          <p>{cmt.userId.userName}</p>
                          <p>{cmt.content}</p>
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
                      render={({ field }) => {
                        if (isOne) {
                          field.value =
                            selectedPerson &&
                            selectedPerson.length > 0 &&
                            selectedPerson.map((a) => a._id);
                          isOne = false;
                        }
                        return (
                          <Select
                            {...field}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            error={errorData.assigneeId}
                            value={field.value || []}
                            onChange={(event) =>
                              handleSelectAssigneeId(event, field)
                            }
                            onFocus={() => handleFocus("assigneeId")}
                            onBlur={(e) =>
                              handleSelectAssigneeIdBlur(
                                "assigneeId",
                                selectedPerson,
                                e
                              )
                            }
                            renderValue={(selected) => {
                              const selectedNames = listMember
                                .filter((item) => selected.includes(item._id))
                                .map((a) => a.userName);

                              return selectedNames.length > 2
                                ? selectedNames.slice(0, 2).join(", ") + " ... "
                                : selectedNames.join(", ");
                            }}
                            MenuProps={MenuProps}
                            InputProps={{
                              readOnly: onlyRead.assigneeId,
                            }}
                            sx={{
                              mb: 1,
                            }}
                          >
                            {listMember.map((person) => (
                              <MenuItem key={person._id} value={person._id}>
                                <Checkbox
                                  checked={
                                    (field.value &&
                                      field.value.length > 0 &&
                                      field.value?.includes(person._id)) ||
                                    false
                                  }
                                />
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  sx={{
                                    ml: 1,
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
                                      width: "150px",
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
                        );
                      }}
                    />
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
                    onFocus={() => handleFocus("link")}
                    onBlur={(e) => handleBlurChange("link", data?.link, e)}
                    onChange={(e) => handleChangeInput("link", e.target.value)}
                    InputProps={{
                      readOnly: onlyRead.link,
                    }}
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
                      value={data?.status ?? ""}
                      onFocus={() => handleFocus("status")}
                      onBlur={(e) =>
                        handleBlurChange("status", data?.status, e)
                      }
                      onChange={(e) =>
                        handleChangeInput("status", e.target.value)
                      }
                      sx={{
                        width: "100%",
                        height: 40,
                      }}
                      displayEmpty
                      InputProps={{
                        readOnly: onlyRead.status,
                      }}
                    >
                      <MenuItem value="">
                        <em>Trạng thái</em>
                      </MenuItem>
                      <MenuItem value={0}>Công việc mới</MenuItem>
                      <MenuItem value={1}>Đang thực hiện</MenuItem>
                      <MenuItem value={2}>Chưa hoàn thành</MenuItem>
                      <MenuItem value={3}>Khóa công việc</MenuItem>
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
                    onFocus={() => handleFocus("startDate")}
                    onBlur={(e) =>
                      handleBlurChange("startDate", data?.startDate, e)
                    }
                    onChange={(e) =>
                      handleChangeInput("startDate", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: onlyRead.startDate,
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
                    onFocus={() => handleFocus("endDate")}
                    onBlur={(e) =>
                      handleBlurChange("endDate", data?.endDate, e)
                    }
                    onChange={(e) =>
                      handleChangeInput("endDate", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: onlyRead.endDate,
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
