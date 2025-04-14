import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createProject,
  getListProjectByUser,
} from "../../../redux/projectSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { getAllUsers } from "../../../services/userService";
import { STATUS_PROJECT } from "../../../config/status";
import { PRIORITY } from "../../../config/priority";
import { toast } from "react-toastify";

const AddProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [managerId, setManagerId] = useState("67d23acb23793aac51e64dc5");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [members, setMembers] = useState([]);
  const [priority, setPriority] = useState("");

  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      name === "" ||
      description === "" ||
      status === "" ||
      members.length === 0 ||
      priority === "" ||
      startDate === "" ||
      endDate === "" ||
      managerId === "" ||
      code === ""
    ) {
      return toast.error("Vui lòng nhập đủ các trường");
    }
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate), "day")) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }
    const formattedMembers = members.map((memberId) => ({ _id: memberId }));

    const newProjectData = {
      name,
      code,
      managerId: { _id: managerId },
      description,
      status: parseInt(status),
      members: formattedMembers,
      priority,
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
    };
    setLoading(true);
    try {
      await dispatch(createProject(newProjectData));
      // Gọi lại API để cập nhật danh sách dự án mới nhất
      await dispatch(getListProjectByUser(users._id));
      toast.success("Thêm dự án thành công");
      onClose();
    } catch (error) {
      toast.error("Thêm dự án thất bại !");
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false); // Kết thúc loading
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await await getAllUsers();
      if (response && response.data) {
        setUsers(response.data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Tạo Dự Án</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
            padding: "16px",
          }}
        >
          <TextField
            label="Tên dự án"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mã dự án"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Người phụ trách</InputLabel>
              <Select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
              >
                <MenuItem value="67d23acb23793aac51e64dc5">Quân già</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={STATUS_PROJECT.PROGRESSING}>
                  Đang tiến hành
                </MenuItem>
                <MenuItem value={STATUS_PROJECT.DONE}>Hoàn thành</MenuItem>
                <MenuItem value={STATUS_PROJECT.ARCHIVED}>Lưu trữ</MenuItem>
              </Select>
            </FormControl>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <DatePicker
                label="Ngày bắt đầu"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD-MM-YYYY"
                disablePast
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD-MM-YYYY"
                minDate={startDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </div>
          </LocalizationProvider>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="priority-label">Độ ưu tiên</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                defaultValue=""
              >
                <MenuItem value="" disabled>
                  Chọn độ ưu tiên
                </MenuItem>
                <MenuItem value={PRIORITY[0].value}>Low</MenuItem>
                <MenuItem value={PRIORITY[1].value}>Medium</MenuItem>
                <MenuItem value={PRIORITY[2].value}>High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Thành viên</InputLabel>
              <Select
                labelId="members-label"
                id="members"
                multiple
                value={members}
                label="Thành viên"
                onChange={(e) => {
                  const { value } = e.target;
                  const isSelectAll = value.includes("all");
                  const allUserIds = users.map((user) => user._id);

                  if (isSelectAll) {
                    // Nếu đã chọn hết rồi => Bỏ chọn tất cả
                    // Nếu chưa chọn hết => Chọn tất cả
                    const isAllSelected = members.length === allUserIds.length;
                    setMembers(isAllSelected ? [] : allUserIds);
                  } else {
                    setMembers(
                      typeof value === "string" ? value.split(",") : value
                    );
                  }
                }}
                renderValue={(selected) => {
                  return selected
                    .map((selectedId) => {
                      const user = users.find(
                        (user) => user._id === selectedId
                      );
                      return user ? user.userName : "";
                    })
                    .join(", ");
                }}
              >
                <MenuItem value="" disabled>
                  Chọn thành viên
                </MenuItem>
                <MenuItem value="all">
                  <em>Tất cả</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.userName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <DialogActions
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button onClick={onClose} color="secondary">
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={loading} // không cho click khi đang loading
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default AddProjectModal;
