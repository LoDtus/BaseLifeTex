import React, { useState } from "react";
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

const MemberListContentAdd = ({ onClose }) => {
  const members = [
    { name: "Nguyễn Đình Minh", avatar: "https://i.pravatar.cc/150?img=10" },
    { name: "Trần Văn A", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Lê Thị B", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Phạm Văn C", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Hoàng Minh D", avatar: "https://i.pravatar.cc/150?img=14" },
  ];

  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  console.log(checkedItems);

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
        {members.map((member, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedItems.includes(member.name)}
                onChange={() => handleCheckboxChange(member.name)}
              />
            }
            label={
              <>
                <Avatar src={member.avatar} />
                <Typography sx={{ ml: 1 }}>{member.name}</Typography>
              </>
            }
          />
        ))}
        <Button variant="contained">Chọn</Button>
      </FormGroup>
    </Box>
  );
};

export default MemberListContentAdd;
