import React, { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";
import {
  createProject,
  updateProject,
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
  ListSubheader,
  Popper,
  Chip,
  Checkbox,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { getAllUsers } from "../../../services/userService";
import { STATUS_PROJECT } from "../../../config/status";
import { PRIORITY } from "../../../config/priority";
import { toast } from "react-toastify";
import { Input } from "antd";
import { Autocomplete } from "@mui/material";

const AddProjectModal = ({ open, onClose, project }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [managerId, setManagerId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [members, setMembers] = useState([]);
  const [priority, setPriority] = useState("");
  const [alert, setAlert] = useState([]);
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const response = await getAllUsers();
  //     if (response?.data) {
  //       setUsers(response.data);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setCode(project.code);
      setManagerId(project.managerId._id);
      setDescription(project.description);
      setStatus(project.status);
      setMembers(project.members.map((member) => member._id));
      setPriority(project.priority);
      setStartDate(dayjs(project.startDate));
      setEndDate(dayjs(project.endDate));
    }
  }, [project]);

  const handleSubmit = async (event) => {
    if (!name)
      setAlert((prev) => (prev.includes("NAME") ? prev : [...prev, "NAME"]));
    else setAlert((prev) => prev.filter((item) => item !== "NAME"));
    if (!code)
      setAlert((prev) => (prev.includes("CODE") ? prev : [...prev, "CODE"]));
    else setAlert((prev) => prev.filter((item) => item !== "CODE"));
    if (!description)
      setAlert((prev) =>
        prev.includes("DESCRIPTION") ? prev : [...prev, "DESCRIPTION"]
      );
    else setAlert((prev) => prev.filter((item) => item !== "DESCRIPTION"));
    if (!priority)
      setAlert((prev) =>
        prev.includes("priority") ? prev : [...prev, "priority"]
      );
    else setAlert((prev) => prev.filter((item) => item !== "priority"));
    if (!status)
      setAlert((prev) =>
        prev.includes("status") ? prev : [...prev, "status"]
      );
    else setAlert((prev) => prev.filter((item) => item !== "status"));

    if (members.length === 0)
      setAlert((prev) =>
        prev.includes("MEMBERS") ? prev : [...prev, "MEMBERS"]
      );
    else setAlert((prev) => prev.filter((item) => item !== "MEMBERS"));
    if (!managerId)
      setAlert((prev) =>
        prev.includes("managerId") ? prev : [...prev, "managerId"]
      );
    else setAlert((prev) => prev.filter((item) => item !== "managerId"));

    if (!startDate || !endDate)
      setAlert((prev) => (prev.includes("DATE") ? prev : [...prev, "DATE"]));
    else setAlert((prev) => prev.filter((item) => item !== "DATE"));

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

    const formData = {
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
    const updateProjectData = {
      name,
      code,
      managerId: managerId,
      description,
      status: parseInt(status),
      members: members.map((memberId) => memberId),
      priority,
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
    };
    setLoading(true);
    try {
      if (project?._id) {
        const data = await dispatch(
          updateProject({
            projectId: project._id,
            projectData: updateProjectData,
          })
        );

        if (updateProject.rejected.match(data)) {
          toast.error(data.data || "Bạn không có quyền sửa project này");
          return;
        }

        await dispatch(getListProjectByUser(users._id));
        toast.success("Cập nhật dự án thành công");
        onClose();
      } else {
        const data = await dispatch(createProject(formData));
        if (createProject.rejected.match(data)) {
          toast.error(data.payload || "Tạo mới thất bại");
          return;
        }

        await dispatch(getListProjectByUser(users._id));
        toast.success("Tạo dự án thành công");
      }

      await dispatch(getListProjectByUser(managerId));
      onClose();
    } catch (err) {
      toast.error(project?._id ? "Cập nhật thất bại" : "Tạo mới thất bại");
      console.error(err);
    } finally {
      setLoading(false);
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchManagerKeyword, setSearchManagerKeyword] = useState("");
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };
  const filteredManagers = useMemo(() => {
    return users.filter(
      (user) =>
        user.role === 0 &&
        removeVietnameseTones(user.userName).includes(
          removeVietnameseTones(searchManagerKeyword)
        )
    );
  }, [users, searchManagerKeyword]);

  const filteredMembers = useMemo(() => {
    return users.filter((user) =>
      removeVietnameseTones(user.userName).includes(
        removeVietnameseTones(searchKeyword)
      )
    );
  }, [users, searchKeyword]);
  const menuProps = {
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 240,
        },
      },
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
      getContentAnchorEl: null,
    },
  };
  // Custom Popper để định vị dropdown menu không bị nhảy lung tung
  // Custom Popper để định vị dropdown menu và giới hạn chiều cao
  const CustomPopper = (props) => (
    <Popper
      {...props}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
      style={{
        ...props.style,
        maxHeight: 200,
        overflowY: "auto",
        zIndex: 1300,
        /* Ẩn thanh cuộn ở các trình duyệt hỗ trợ */
        scrollbarWidth: "none", // Firefox
        WebkitOverflowScrolling: "touch", // Cho phép cuộn mềm mại trên các thiết bị di động
        "-webkit-scrollbar": { display: "none" }, // Đối với các trình duyệt hỗ trợ webkit (Chrome, Safari)
      }}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      className: "!rounded-2xl", 
    }}>
      <DialogTitle
        className="text-center border-b-1 border-black p-3 border-gray"
        sx={{ marginBottom: 0, paddingBottom: 0, fontWeight: 600  }}
      >
        {project?._id ? "Cập Nhật Dự Án" : "Tạo Dự Án"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "0px 16px 16px",
        }}
      >
        <DialogContent
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",

            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <span className={alert.includes("NAME") ? "!text-red" : ""}>
            Tên dự án <span className="!text-red">*</span>
          </span>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <span className={alert.includes("CODE") ? "!text-red" : ""}>
            Mã dự án <span className="!text-red">*</span>
          </span>
          <TextField
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <span className={alert.includes("DESCRIPTION") ? "!text-red" : ""}>
            Mô tả dự án <span className="!text-red">*</span>
          </span>
          <TextField
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
              <span
                className={
                  alert.includes("managerId")
                    ? "!text-red mb-16-custom"
                    : "mb-16-custom"
                }
              >
                Người phụ trách <span className="!text-red">*</span>
              </span>
              <Autocomplete
                options={users.filter((user) => user.role === 0)}
                getOptionLabel={(option) => option.userName || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Tìm người phụ trách..."
                    fullWidth
                  />
                )}
                value={users.find((user) => user._id === managerId) || null}
                onChange={(event, newValue) => {
                  setManagerId(newValue ? newValue._id : "");
                }}
                filterOptions={(options, state) => {
                  const input = removeVietnameseTones(
                    state.inputValue.toLowerCase()
                  );
                  return options.filter((option) =>
                    removeVietnameseTones(
                      option.userName.toLowerCase()
                    ).includes(input)
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                PopperComponent={CustomPopper}
              />
            </FormControl>

            <FormControl fullWidth>
              <span
                className={
                  alert.includes("MEMBERS")
                    ? "!text-red mb-16-custom"
                    : "mb-16-custom"
                }
              >
                Thành viên <span className="!text-red">*</span>
              </span>
              <Autocomplete
                multiple
                disableCloseOnSelect // Giữ menu khi chọn xong
                options={[
                  { _id: "all", userName: "Chọn tất cả" },
                  ...filteredMembers,
                ]}
                getOptionLabel={(option) => option.userName}
                value={users.filter((user) => members.includes(user._id))}
                onChange={(event, newValue, reason) => {
                  if (!newValue) return;

                  const isSelectAll = newValue.some((v) => v._id === "all");
                  const allUserIds = filteredMembers.map((user) => user._id);

                  if (isSelectAll) {
                    const isAllSelected = members.length === allUserIds.length;
                    setMembers(isAllSelected ? [] : allUserIds);
                  } else {
                    setMembers(newValue.map((user) => user._id));
                  }
                }}
                filterOptions={(options, state) => {
                  const input = removeVietnameseTones(
                    state.inputValue.toLowerCase()
                  );
                  return options.filter((option) =>
                    removeVietnameseTones(
                      option.userName.toLowerCase()
                    ).includes(input)
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Tìm thành viên..." />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option._id}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      checked={
                        option._id === "all"
                          ? members.length === filteredMembers.length
                          : selected
                      }
                    />
                    {option.userName}
                  </li>
                )}
                renderTags={(selected, getTagProps) => {
                  const maxTags = 1; // Giới hạn số lượng thẻ hiển thị
                  const tagsToShow = selected.slice(0, maxTags); // Lấy 2 thẻ đầu tiên
                  return (
                    <>
                      {tagsToShow.map((option, index) => (
                        <Chip
                          key={option._id}
                          label={option.userName}
                          size="small"
                          {...getTagProps({ index })}
                          style={{ margin: 2 }}
                        />
                      ))}
                      {selected.length > maxTags && (
                        <Chip label="..." size="small" style={{ margin: 2 }} />
                      )}
                    </>
                  );
                }}
                PopperComponent={CustomPopper}
              />
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
              <div>
                <span
                  className={
                    alert.includes("DATE")
                      ? "!text-red mb-16-custom"
                      : "mb-16-custom"
                  }
                >
                  Ngày bắt đầu <span className="!text-red">*</span>
                </span>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ marginTop: "16px" }}
                />
              </div>
              <div>
                <span
                  className={
                    alert.includes("DATE")
                      ? "!text-red mb-16-custom"
                      : "mb-16-custom"
                  }
                >
                  Ngày kết thúc <span className="!text-red">*</span>
                </span>
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="DD-MM-YYYY"
                  minDate={startDate}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ marginTop: "16px" }}
                />
              </div>
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
              <span
                className={
                  alert.includes("priority")
                    ? "!text-red mb-16-custom"
                    : "mb-16-custom"
                }
              >
                Độ ưu tiên <span className="!text-red">*</span>
              </span>
              <Select
                labelId="priority-label"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                defaultValue=""
              >
                <MenuItem value="" disabled>
                  Chọn độ ưu tiên <span className="!text-red">*</span>
                </MenuItem>
                <MenuItem value={PRIORITY[0].value}>Thấp</MenuItem>
                <MenuItem value={PRIORITY[1].value}>Trung bình</MenuItem>
                <MenuItem value={PRIORITY[2].value}>Cao</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <span
                className={
                  alert.includes("status")
                    ? "!text-red mb-16-custom"
                    : "mb-16-custom"
                }
              >
                Trạng thái <span className="!text-red">*</span>
              </span>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={STATUS_PROJECT.PROGRESSING}>
                  Đang thực hiện
                </MenuItem>
                <MenuItem value={STATUS_PROJECT.DONE}>Chưa hoàn thành</MenuItem>
                <MenuItem value={STATUS_PROJECT.ARCHIVED}>
                  Đã hoàn thành
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            position: "sticky", // hoặc "fixed" nếu bạn muốn nó dính cả khi dialog cao hơn màn hình
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "#fff",
            display: "flex",
            paddingRight: "30px",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} color="secondary">
            Hủy
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={loading} // không cho click khi đang loading
            // startIcon={
            //   loading && <CircularProgress size={20} color="inherit" />
            // }
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" />{" "}
                {project?._id ? "Đang cập nhật..." : "Đang thêm..."}
              </>
            ) : project?._id ? (
              "Cập nhật"
            ) : (
              "Thêm"
            )}
          </Button>
        </DialogActions>
      </form>
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
