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
import { updateIssueData } from "../../../../services/issueService";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/EditFormv2.module.scss"
import { toast } from "react-toastify";
import Loading from "../../../common/Loading";
import { getListTaskByProjectIdRedux } from "@/redux/taskSlice";

export default function EditFormv2({ isOpen, onClose, task }) {
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
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      link: task?.link || "",
      description: task?.description || "",
      startDate: task.startDate ? task.startDate.split("T")[0] : "",
      endDate: task.endDate ? task.endDate.split("T")[0] : "",
      assigneeId: task?.assigneeId.map((ass) => ass._id) || [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true); // Bắt đầu loading
    try {
      await updateIssueData(task._id, {
        ...data,
        image,
        status: task.status,
        projectId: task.projectId,
        assignerId: user.data.user._id,
      });
      toast.success("Cập nhật nhiệm vụ thành công");
      onClose();
    } catch (error) {
      toast.error("Cập nhật nhiệm vụ thất bại", error);
      onClose();
      throw error;
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getlistUser(task.projectId);
      setSelectedPerson(data.data);
    };
    fetchData();
  }, [task]);

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
          Sửa công việc
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

      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Row 1: Tên vấn đề và Link */}
              <Grid item xs={12} md={6}>
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
                    Link:
                  </Typography>
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...register("link", { required: true })}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {errors.link && (
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
                    <FormControl fullWidth size="small">
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
                                ?.map(
                                  (id) =>
                                    selectedPerson.find(
                                      (person) => person._id === id
                                    )?.userName
                                )
                                .join(",")
                            }
                            MenuProps={MenuProps}
                            sx={{
                              mb: 1,
                            }}
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
                                    src={
                                      person.avatar ||
                                      "image\\f8ad738c648cb0c7cc815d6ceda805b0.png"
                                    }
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
                        onImageChange={(file) => setImage(file)}
                        Image={task.image}
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
      )}
    </Dialog>
  );
};
