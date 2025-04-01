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
import "../../styles/ListView.scss";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast } from "react-toastify";
import { convertDate, convertStatus } from "../../../../utils/convertUtils";
import { useForm, Controller } from "react-hook-form";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { getlistUser } from "../../../../services/userService";
import { getTaskDetailById } from "../../../../services/taskService";
import {
  getPaginateCommentByTask,
  addCommentTask,
} from "../../../../services/commentService";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../../common/Loading";

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

export default function TaskDetailView({ task, handleClose }) {
  const { control } = useForm();
  const [data, setData] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [listMember, setListMember] = useState([]);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const getMemberByProject = async (projectId) => {
    const response = await getlistUser(projectId);
    if (response.success === true) {
      setListMember(response.data && response.data);
    }
  };

  const getPaginateComment = async (id, page, limit) => {
    if (user) {
      let response = await getPaginateCommentByTask(id, page, limit);
      if (response && response.success === true) {
        setComments(response.data);
        setPage(response.page);
        setTotalPage(response.totalPage);
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (task) {
      getPaginateComment(task._id, page, limit);
    }
  }, [task, page, limit]);

  const getDetailtask = async (id) => {
    setLoading(true);
    try {
      let res = await getTaskDetailById(id);
      if (res && res.data && res.success === true) {
        setData({ ...res.data });
        setSelectedPerson(task.assigneeId);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      getMemberByProject(task.projectId);
      getDetailtask(task._id);
    }
  }, [task]);

  let isOne = true;

  const handleAddComment = async () => {
    if (user && user.data) {
      if (comment) {
        let res = await addCommentTask({
          taskId: data._id,
          content: comment,
        });
        if (res) {
          setComment("");
        } else {
          toast.error(res.message);
          setComment("");
        }
      } else {
        toast.error("Bình luận không được để trống!");
      }
    } else {
      toast.warning("Đăng nhập để thực hiện yêu cầu này!");
    }
    getPaginateComment(task._id, page, limit);
  };

  const handleKeyDown = () => {
    if (event.key === "Enter") {
      handleAddComment();
    }
  };

  const handleCancel = () => {
    setComment("");
  };

  return (
    <>
      <Modal
        open={true}
        style={{ border: "none", outline: "none" }}
        onClose={handleClose}
        className="modal-container"
      >
        {loading ? (
          <Loading />
        ) : (
          <Box className="kaban-detail">
            <div className="kaban-detail-header">
              <p>
                <EventAvailableIcon /> kan-1
              </p>
              <button className="close-btn" onClick={handleClose}>
                <CloseIcon />
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
                    placeholder="Nhập vấn đề..."
                    value={data?.title ?? ""}
                    className="kaban-content-text-edit"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={4}
                    sx={{ marginTop: "8px" }}
                    placeholder="Nhập nội dung..."
                    value={data?.description ?? ""}
                    InputProps={{
                      readOnly: true,
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
                          src={user.data.image || "https://i.pinimg.com/1200x/05/2b/0f/052b0f418b78486c4e97b7c0c3aa43bf.jpg"}
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
                          onKeyDown={() => handleKeyDown()}
                          onChange={(e) => {
                            setComment(e.target.value);
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
                    className={
                      user ? "comment-list fix-height" : "comment-list"
                    }
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
                <h4>Thông tin chi tiết</h4>
                <div className="kaban-description">
                  <p>Người nhận việc:</p>
                  <div className="kaban-description-personName-edit">
                    <FormControl fullWidth size="small">
                      <Controller
                        name="assigneeId"
                        control={control}
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
                              value={field.value || []}
                              renderValue={(selected) => {
                                const selectedNames = listMember
                                  .filter((item) => selected.includes(item._id))
                                  .map((a) => a.userName);

                                return selectedNames.length > 2
                                  ? selectedNames.slice(0, 2).join(", ") +
                                      " ... "
                                  : selectedNames.join(", ");
                              }}
                              MenuProps={MenuProps}
                              sx={{
                                mb: 1,
                              }}
                            >
                              {listMember.length > 0 &&
                                listMember.map((person) => (
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
                                        src={person.avatar}
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
                      placeholder="Nhập link..."
                      value={data?.link ?? ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
                <div className="kaban-description image">
                  <p>Hình ảnh:</p>
                  <div className="kaban-description-image">
                    <Zoom>
                      <img
                        src={
                          data?.image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKCI0jyuDli7hTwPGh90HItM5yF-HOF_pzrQ&s"
                        }
                        alt="image"
                      />
                    </Zoom>
                  </div>
                </div>
                <div className="kaban-description">
                  <p>Trạng thái:</p>
                  <div className="kaban-single-info">
                    <FormControl>
                      <Select
                        size="small"
                        value={convertStatus(data?.status)}
                        sx={{
                          width: "100%",
                          height: 40,
                        }}
                        readOnly={true}
                      >
                        <MenuItem value="Công việc mới">Công việc mới</MenuItem>
                        <MenuItem value="Đang thực hiện">
                          Đang thực hiện
                        </MenuItem>
                        <MenuItem value="Chưa hoàn thành">
                          Chưa hoàn thành
                        </MenuItem>
                        <MenuItem value="Khóa công việc">
                          Khóa công việc
                        </MenuItem>
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
                      value={convertDate(data?.startDate)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      readOnly={true}
                      sx={{ mb: 2, outline: "none" }}
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
                      value={convertDate(data?.endDate)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      readOnly={true}
                      sx={{ mb: 2 }}
                    />
                  </div>
                </div>
                <div className="kaban-description">
                  <p className="assginer">Người báo cáo:</p>
                  {data?.assignerId && (
                    <div className="kaban-single-info">
                      <img src={"https://i.pinimg.com/1200x/05/2b/0f/052b0f418b78486c4e97b7c0c3aa43bf.jpg"} alt="" />
                      <p>{data?.assignerId && data?.assignerId.userName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Box>
        )}
      </Modal>
    </>
  );
};