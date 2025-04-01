import React, { useEffect, useState } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useDispatch } from "react-redux";
import "./styles/FilterDialog.scss";
import { filterTaskInProject } from "../../redux/taskSlice";
import { getlistUserInProjects } from "../../services/taskService";

export default function FilterDialog({ idProject }) {
  const [filters, setFilters] = useState({
    assigneeId: "",
    assignerId: "",
    startDate: "",
    endDate: "",
  });

  const [listMember, setListMember] = useState([]);

  useEffect(() => {
    const getMemberByProject = async () => {
      const response = await getlistUserInProjects(idProject);
      if (response.data.success === true) {
        setListMember(response.data.data);
      }
    };
    getMemberByProject();
  }, [idProject]);

  function handleChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }
  const dispatch = useDispatch();

  const onfilterTask = () => {
    dispatch(filterTaskInProject({ projectId: idProject, data: filters }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1} padding={2}>
      <h2 className="title-filter">Lọc Công Việc</h2>
      {/* Người được giao */}
      <TextField
        select
        label="Người được giao"
        value={filters.assigneeId}
        onChange={(e) => handleChange("assigneeId", e.target.value)}
        fullWidth
      >
        {listMember.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.userName}
          </MenuItem>
        ))}
      </TextField>

      {/* Người báo cáo */}
      <TextField
        select
        label="Người báo cáo"
        value={filters.assignerId}
        onChange={(e) => handleChange("assignerId", e.target.value)}
        fullWidth
      >
        {listMember.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.userName}
          </MenuItem>
        ))}
      </TextField>

      {/* Ngày giao việc */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Ngày giao việc"
            // value={filters.startDate}
            onChange={(newValue) => handleChange("startDate", newValue)}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* Ngày kết thúc */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Ngày kết thúc"
            // value={filters.endDate}
            onChange={(newValue) => handleChange("endDate", newValue)}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* Button Lọc */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onfilterTask}
      >
        Lọc
      </Button>
    </Box>
  );
}
