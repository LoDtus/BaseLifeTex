import React, { useEffect, useState } from "react";
import { Box, Button, TextField, MenuItem, Autocomplete } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useDispatch, useSelector } from "react-redux";
import "./styles/FilterDialog.scss";
import { filterTaskInProject } from "../../redux/taskSlice";
import { getlistUserInProjects } from "../../services/taskService";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

export default function FilterDialog({ idProject }) {
  const [filters, setFilters] = useState({
    assigneeId: "",
    assignerId: "",
    startDate: null,
    endDate: null,
  });
  const viewMode = useSelector((state) => state.viewMode.mode);

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
    dispatch(
      filterTaskInProject({
        projectId: idProject,
        page: 1,
        limit: viewMode === "list" ? 20 : 100,
        data: filters,
      })
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1} padding={2}>
      <div className="header-filter">
        <h2 className="title-filter">Lọc Công Việc</h2>
        <FilterAltOffIcon
          sx={{ color: "#579AD7", cursor: "pointer" }}
          onClick={() => {
            setFilters({
              assigneeId: "",
              assignerId: "",
              startDate: null,
              endDate: null,
            });
          }}
        />
      </div>
      {/* Người được giao */}
      <Autocomplete
        options={listMember}
        getOptionLabel={(option) => option.userName}
        value={
          listMember.find((user) => user._id === filters?.assigneeId) || null
        }
        onChange={(event, newValue) => {
          handleChange("assigneeId", newValue ? newValue._id : "");
        }}
        renderInput={(params) => (
          <TextField {...params} label="Người được giao" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />

      {/* Người báo cáo */}
      <Autocomplete
        options={listMember}
        getOptionLabel={(option) => option.userName}
        value={
          listMember.find((user) => user._id === filters?.assignerId) || null
        }
        onChange={(event, newValue) => {
          handleChange("assignerId", newValue ? newValue._id : "");
        }}
        renderInput={(params) => (
          <TextField {...params} label="Người báo cáo" fullWidth />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />

      {/* Ngày giao việc */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Ngày giao việc"
            value={filters.startDate}
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
            value={filters.endDate}
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
