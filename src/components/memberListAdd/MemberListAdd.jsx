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
} from "@mui/material";
import "./MemberListAdd.scss";
import CloseIcon from "@mui/icons-material/Close";
import { addMemberTask } from "../../apis/Issue";
import { getlistUserInProjects } from "../../services/taskService";

const MemberListContentAdd = ({ onClose, idProject, task, toast }) => {
  const [listMember, setListMember] = useState([]);
  console.log(idProject);

  const getMemberByProject = async () => {
    const response = await getlistUserInProjects(idProject);

    if (response.data.success === true) {
      setListMember(response.data.data.members);
    }
  };
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    getMemberByProject();
    setCheckedItems(task?.assigneeId.map((i) => i._id));
  }, [idProject]);
  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addMember = async () => {
    const respone = await addMemberTask(task._id, {
      userId: checkedItems,
    });
    // console.log(respone);
    if (respone.message === "Thêm người dùng vào task thành công") {
      toast.success(respone.message, { autoClose: 3000 });
    } else {
      toast.error(respone.message, { autoClose: 3000 });
    }
    onClose();
  };

  return (
    <Box
      sx={{
        width: "343px",
        position: "relative",
        paddingLeft: "14px",
        paddingBottom: "30px",
      }}
    >
      <Box sx={{ position: "absolute", right: "10px", top: "-13px" }}>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography
        sx={{
          marginTop: "28px",
          color: "#485F7E",
          fontSize: "18px",
          marginBottom: "15px",
        }}
        fontWeight="bold"
      >
        Danh sách thành viên
      </Typography>
      {/* Danh sách thành viên */}
      <FormGroup>
        {listMember?.map((member, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedItems.includes(member._id)}
                onChange={() => handleCheckboxChange(member._id)}
              />
            }
            label={
              <>
                <Avatar src={member?.avatar} />
                <Typography sx={{ ml: 1 }}>{member.userName}</Typography>
              </>
            }
          />
        ))}
        <Button variant="contained" onClick={addMember}>
          Chọn
        </Button>
      </FormGroup>
    </Box>
  );
};

export default MemberListContentAdd;
