import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MemberListContent = ({ onClose }) => {
  const members = [
    { name: "Nguyễn Đình Minh", avatar: "https://i.pravatar.cc/150?img=10" },
    { name: "Trần Văn A", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Lê Thị B", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Phạm Văn C", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Hoàng Minh D", avatar: "https://i.pravatar.cc/150?img=14" },
  ];

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
        Danh sách thành viên công việc
      </Typography>
      {/* Danh sách thành viên */}
      {members.map((member, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            py: 1,
            "&:hover": { bgcolor: "#f5f5f5", borderRadius: 1 },
            marginTop: "21px",
          }}
        >
          <Avatar src={member.avatar} />
          <Typography sx={{ ml: 1 }}>{member.name}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MemberListContent;
