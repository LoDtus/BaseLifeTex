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
import UploadImageButton from "../UploadDownloadImage/UploadDownloadImage";
import { getlistUser } from "../../apis/use";
import { updateIssueDataImage } from "../../apis/Issue";
import { ToastContainer, toast } from "react-toastify";

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

// Using a simpler date input approach instead of MUI date pickers

const EditForm = ({ isOpen, onClose, task, idProject }) => {
  const token = "jhgshddabjsbbdak";
  const [listMember, setListMember] = useState([]);
  const getMemberByProject = async () => {
    const response = await getlistUser(token, idProject);
    if (response.members) {
      setListMember(response.members);
    }
  };

  const [image, setImage] = useState(task?.images || "");
  const [imageFile, setImageFile] = useState(task?.images || "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset, // Reset form values when task updates
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      link: task?.link || "",
      description: task?.description || "",
      startDate: task?.startDate
        ? new Date(task.startDate).toISOString().split("T")[0]
        : "",
      endDate: task?.endDate
        ? new Date(task.endDate).toISOString().split("T")[0]
        : "",
      assigneeId: task?.assigneeId?.map((i) => i._id) || [],
      status: task.status,
      projectId: task.projectId,
      assignerId: task?.assignerId?._id,
    },
  });

  useEffect(() => {
    getMemberByProject();
    reset({
      title: task?.title || "",
      description: task?.description || "",
      startDate: task?.startDate
        ? new Date(task.startDate).toISOString().split("T")[0]
        : "",
      endDate: task?.endDate
        ? new Date(task.endDate).toISOString().split("T")[0]
        : "",
      assigneeId: task?.assigneeId?.map((i) => i._id) || [],
      status: task.status,
      projectId: task.projectId,
      assignerId: task?.assignerId?._id,
    });
    setImage(task?.images || ""); // Reset image when task updates
  }, [task, reset]);

  const onSubmit = async (data) => {
    const response = await updateIssueDataImage(
      task._id,
      {
        ...data,
      },
      imageFile
    );
    // console.log(response);
    if (response.message === "Nhiệm vụ cập nhật thành công") {
      toast.success(response.message, { autoClose: 3000 });
      onClose();
    } else {
      toast.error(response.message, { autoClose: 3000 });
      //   onClose();
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "10px",
          padding: "10px",
          maxHeight: "100vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          borderBottom: "1px solid #e0e0e0",
          m: 0,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "#1976d2", fontWeight: "bold" }}
        >
          Chỉnh sửa công việc
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Row 1: Tên vấn đề và Link */}
            <Grid item xs={24} md={24}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: "#666",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    mr: 1.5,
                  }}
                >
                  Tên vấn đề:
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register("title", { required: true })}
                    size="small"
                    sx={{ mb: 1 }}
                    defaultValue={task.title}
                  />
                  {errors.title && (
                    <Typography
                      variant="span"
                      sx={{
                        color: "red",
                        fontSize: "small",
                      }}
                    >
                      Trường này không được để trống.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Row 2: Mô tả chi tiết và Người nhận việc, Hình ảnh */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: "#666",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  Mô tả chi tiết:
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register("description", { required: true })}
                    multiline
                    rows={6}
                    sx={{ mb: 1 }}
                    defaultValue={task.description}
                  />
                  {errors.description && (
                    <Typography
                      variant="span"
                      sx={{
                        color: "red",
                        fontSize: "small",
                      }}
                    >
                      Trường này không được để trống.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      color: "#666",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    Người nhận việc:
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.personName}
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
                    {errors.personName && (
                      <Typography
                        variant="span"
                        sx={{
                          color: "red",
                          fontSize: "small",
                        }}
                      >
                        {errors.personName.message}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      color: "#666",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    Hình ảnh:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // border: "1px dashed #ccc",
                      borderRadius: "5px",
                      p: 2,
                      mb: 2,
                      ml: 4.5,
                      cursor: "pointer",
                    }}
                  >
                    <UploadImageButton
                      setImage={setImage}
                      setImageFile={setImageFile}
                      image={image ? image : task?.image}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Row 3: Ngày bắt đầu và Ngày kết thúc */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: "#666",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  Ngày bắt đầu:
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    {...register("startDate", { required: true })}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mb: 1 }}
                    defaultValue={
                      task?.endDate
                        ? new Date(task.startDate).toISOString().split("T")[0]
                        : ""
                    }
                  />
                  {errors.startDate && (
                    <Typography
                      variant="span"
                      sx={{
                        color: "red",
                        fontSize: "small",
                      }}
                    >
                      Trường này không được để trống.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: "#666",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  Ngày kết thúc:
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    {...register("endDate", { required: true })}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mb: 1 }}
                    defaultValue={
                      task?.endDate
                        ? new Date(task.endDate).toISOString().split("T")[0]
                        : ""
                    }
                  />
                  {errors.endDate && (
                    <Typography
                      variant="span"
                      sx={{
                        color: "red",
                        fontSize: "small",
                      }}
                    >
                      Trường này không được để trống.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: "#1976d2",
              borderRadius: "24px",
              textTransform: "none",
              px: 8,
            }}
          >
            Sửa
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditForm;

// Example usage:
