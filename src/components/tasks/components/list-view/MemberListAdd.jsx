// src/components/memberListAdd/MemberListAdd.jsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  TextField,
} from "@mui/material";
import "../../styles/MemberListAdd.scss";
import CloseIcon from "@mui/icons-material/Close";
import { addMemberTask } from "@/services/issueService";
import { getlistUserInProjects } from "@/services/taskService";
import img from "../../../../../public/imgs/basic-user.png"

export default function MemberListContentAdd({
  onClose,
  idProject,
  task,
  fetchApi,
  toast,
}) {
  const [listMember, setListMember] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const getMemberByProject = async () => {
    const response = await getlistUserInProjects(idProject);
    if (response.data.success === true) {
      setListMember(response.data.data);
    }
  };

  useEffect(() => {
    getMemberByProject();
    setCheckedItems(task?.assigneeId.map((i) => i._id) || []);
  }, [idProject, task]);

  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addMember = async () => {
    try {
      const response = await addMemberTask(task._id, {
        userId: checkedItems,
      });
      if (response) {
        toast.success("Thêm thành viên thành công");
        fetchApi();
      }
    } catch (error) {
      // console.log(error);

      toast.error(error.response.data.message);
    } finally {
      onClose();
    }
  };
  const filteredMembers = listMember.filter((member) =>
    member.userName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "343px",
        position: "relative",
        paddingLeft: "14px",
        paddingBottom: "10px",
        height: "550px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          flexShrink: 0,
          zIndex: 10,
          backgroundColor: "white",
          paddingTop: "5px",
          // paddingBottom: "5px",
        }}
      >
        <Box sx={{ position: "absolute", right: "10px", top: "17px" }}>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          sx={{
            marginTop: "22px",
            color: "#485F7E",
            fontSize: "18px",
            marginBottom: "15px",
          }}
          fontWeight="bold"
        >
          Danh sách thành viên
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm thành viên..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size="small"
          sx={{
            marginBottom: "12px",
            width: "90%",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          marginTop: "5px",
          paddingRight: "4px",
        }}
      >
        <FormGroup>
          {/* Checkbox chọn tất cả */}
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  listMember.length > 0 &&
                  checkedItems.length === listMember.length
                }
                indeterminate={
                  checkedItems.length > 0 &&
                  checkedItems.length < listMember.length
                }
                onChange={() => {
                  const allIds = listMember.map((member) => member._id);
                  if (checkedItems.length === listMember.length) {
                    setCheckedItems([]); // Bỏ chọn tất cả
                  } else {
                    setCheckedItems(allIds); // Chọn tất cả
                  }
                }}
              />
            }
            label="Chọn tất cả"
          />

          {/* Danh sách thành viên */}
          {filteredMembers.map((member, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={checkedItems.includes(member._id)}
                  onChange={() => handleCheckboxChange(member._id)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={member?.avatar || img} />
                  <Typography sx={{ ml: 1 }}>{member.userName}</Typography>
                </Box>
              }
            />
          ))}
        </FormGroup>
      </Box>
      <Box
        sx={{
          paddingTop: "10px",
          backgroundColor: "#fff",
          textAlign: "center",
          flexShrink: 0,
          marginRight: "13px",
        }}
      >
        <Button variant="contained" fullWidth onClick={addMember}>
          Chọn
        </Button>
      </Box>
    </Box>
  );
}
