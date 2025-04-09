import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import UploadImageButton from "../../../common/UploadDownloadImage";
import { getlistUser } from "../../../../services/userService";
import { postIssueData } from "../../../../services/issueService";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../common/Loading";
import { getListTaskByProjectId } from "../../../../redux/taskSlice";
import { PRIORITY } from "../../../../config/priority";

const IssueForm = ({ isOpen, onClose, status }) => {
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

  const [searchParams] = useSearchParams();
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const idProject = searchParams.get("idProject");
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    try {
      const issueData = await postIssueData({
        ...data,
        image,
        status,
        idProject,
        assignerId: user.data.user._id,
        priority: data.priority,
        type: data.type,
      });
      if (issueData) {
        toast.success("Tạo nhiệm vụ thành công");
        dispatch(
          getListTaskByProjectId({
            projectId: idProject,
            page: 1,
            limit: 100,
          })
        );
        reset();
        onClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getlistUser(idProject);
      setSelectedPerson(data.data);
    };
    fetchData();
  }, [searchParams, idProject]);

  const handleImageChange = (file) => {
    setImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl); // Lưu URL tạm thời
    } else {
      setImageUrl(null);
    }
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
    display: "block",
  };

  const inputStyle = {
    marginBottom: "8px",
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px",
          padding: "24px",
          maxHeight: "95vh",
          overflowY: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          borderBottom: "1px solid #eee",
          padding: "16px 24px",
          marginBottom: "24px",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ color: "#1976d2", fontWeight: "600" }}
        >
          Tạo công việc
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ padding: "0 24px" }}>
            <Grid container spacing={3}>
              {/* Row 1: Tên công việc và Link */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="title" style={labelStyle}>
                    Tên công việc:
                  </label>
                  <TextField
                    id="title"
                    variant="outlined"
                    {...register("title", {
                      required: "Tên công việc không được để trống.",
                    })}
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="link" style={labelStyle}>
                    Link:
                  </label>
                  <TextField
                    id="link"
                    variant="outlined"
                    {...register("link", {
                      required: "Link không được để trống.",
                    })}
                    size="small"
                    error={!!errors.link}
                    helperText={errors.link?.message}
                  />
                </FormControl>
              </Grid>

              {/* Row 2: Mô tả chi tiết */}
              <Grid item xs={12}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="description" style={labelStyle}>
                    Mô tả chi tiết:
                  </label>
                  <textarea
                    id="description"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "0.875rem",
                      lineHeight: 1.43,
                      resize: "vertical",
                      minHeight: "100px",
                    }}
                    rows={4}
                    {...register("description", {
                      required: "Mô tả chi tiết không được để trống.",
                    })}
                  />
                  {errors.description && (
                    <Typography variant="caption" color="error">
                      {errors.description.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Row 3: Người nhận việc */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="personName" style={labelStyle}>
                    Người nhận việc:
                  </label>
                  <Controller
                    name="personName"
                    control={control}
                    rules={{
                      required: "Vui lòng chọn ít nhất một người nhận việc",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="personName-label"
                        id="personName"
                        multiple
                        value={field.value || []}
                        onChange={(event) => field.onChange(event.target.value)}
                        renderValue={(selected) =>
                          selected
                            ?.map(
                              (id) =>
                                selectedPerson.find(
                                  (person) => person._id === id
                                )?.userName
                            )
                            .join(", ")
                        }
                        MenuProps={MenuProps}
                        size="small"
                        error={!!errors.personName}
                      >
                        {selectedPerson?.map((person) => (
                          <MenuItem key={person._id} value={person._id}>
                            <Checkbox
                              checked={
                                field.value?.includes(person._id) || false
                              }
                            />
                            <Box
                              display="flex"
                              alignItems="center"
                              sx={{ ml: 1 }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "purple",
                                  width: 30,
                                  height: 30,
                                  marginRight: 1,
                                }}
                                src={
                                  person.avatar ||
                                  "/imgs/f8ad738c648cb0c7cc815d6ceda805b0.png"
                                }
                              />
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  width: "180px",
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
                  {errors.personName && (
                    <Typography variant="caption" color="error">
                      {errors.personName.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Row 4: Hình ảnh */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label style={labelStyle}>Hình ảnh:</label>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      border: "1px dashed #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#999",
                      },
                    }}
                  >
                    <UploadImageButton
                      onImageChange={handleImageChange}
                      Image={imageUrl} // Truyền URL tạm thời xuống UploadImageButton
                    />
                    {image && (
                      <Typography
                        variant="caption"
                        sx={{ ml: 2, color: "green" }}
                      >
                        Đã chọn ảnh
                      </Typography>
                    )}
                    {!image && (
                      <Typography variant="caption" color="textSecondary">
                        Chọn hình ảnh liên quan đến công việc (tùy chọn)
                      </Typography>
                    )}
                  </Box>
                </FormControl>
              </Grid>

              {/* Row 5: Ngày bắt đầu */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="startDate" style={labelStyle}>
                    Ngày bắt đầu:
                  </label>
                  <TextField
                    id="startDate"
                    variant="outlined"
                    type="date"
                    {...register("startDate", {
                      required: "Ngày bắt đầu không được để trống.",
                    })}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                </FormControl>
              </Grid>

              {/* Row 6: Ngày kết thúc */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="endDate" style={labelStyle}>
                    Ngày kết thúc:
                  </label>
                  <TextField
                    id="endDate"
                    variant="outlined"
                    type="date"
                    {...register("endDate", {
                      required: "Ngày kết thúc không được để trống.",
                    })}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                  />
                </FormControl>
              </Grid>

              {/* Row 7: Độ ưu tiên */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="priority" style={labelStyle}>
                    Độ ưu tiên:
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Vui lòng chọn độ ưu tiên" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        variant="outlined"
                        size="small"
                        error={!!errors.priority}
                      >
                        {PRIORITY.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.priority && (
                    <Typography variant="caption" color="error">
                      {errors.priority.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Row 8: Phân loại */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <label htmlFor="type" style={labelStyle}>
                    Phân loại:
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Vui lòng chọn loại" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        variant="outlined"
                        size="small"
                        error={!!errors.type}
                      >
                        <MenuItem value="bug">Bug</MenuItem>
                        <MenuItem value="new_request">Yêu cầu mới</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <Typography variant="caption" color="error">
                      {errors.type.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "flex-end", padding: "16px 24px" }}
          >
            <Button onClick={onClose} sx={{ textTransform: "none" }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: "#1976d2",
                borderRadius: "4px",
                textTransform: "none",
                padding: "8px 20px",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
            >
              Tạo
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default IssueForm;
