import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createProject } from "../../../redux/projectSlice";
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
} from "@mui/material";
import { getAllUsers } from "../../../services/userService";
import { STATUS_PROJECT } from "../../../config/status";
import { PRIORITY } from "../../../config/priority";

const AddProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("67d23acb23793aac51e64dc5");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [members, setMembers] = useState([]);
  const [priority, setPriority] = useState("");
  const [users, setUsers] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedMembers = members.map((memberId) => ({ _id: memberId }));
    const newProjectData = {
      name,
      managerId: { _id: managerId },
      description,
      status: parseInt(status),
      members: formattedMembers,
      priority,
    };
    dispatch(createProject(newProjectData));
    onClose();
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
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
                required
              >
                <MenuItem value="67d23acb23793aac51e64dc5">Quân già</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <MenuItem value={STATUS_PROJECT.PROGRESSING}>
                  Đang tiến hành
                </MenuItem>
                <MenuItem value={STATUS_PROJECT.DONE}>Hoàn thành</MenuItem>
                <MenuItem value={STATUS_PROJECT.ARCHIVED}>Lưu trữ</MenuItem>
              </Select>
            </FormControl>
          </div>
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
                required
                defaultValue=""
              >
                <MenuItem value="" disabled>
                  Chọn độ ưu tiên
                </MenuItem>
                <MenuItem value={PRIORITY.LOW}>Low</MenuItem>
                <MenuItem value={PRIORITY.MEDIUM}>Medium</MenuItem>
                <MenuItem value={PRIORITY.HIGH}>High</MenuItem>
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
                  setMembers(
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
                defaultValue=""
                renderValue={(selected) => {
                  return selected
                    .map((selectedId) => {
                      const user = users.find(
                        (user) => user._id === selectedId
                      );
                      return user ? user.userName : ""; // Trả về userName nếu tìm thấy, không thì trả về chuỗi rỗng
                    })
                    .join(", ");
                }}
              >
                <MenuItem value="" disabled>
                  Chọn thành viên
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
            <Button type="submit" color="primary">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
