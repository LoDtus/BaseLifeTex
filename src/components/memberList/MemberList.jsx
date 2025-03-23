import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MemberListContent = ({ onClose, members }) => {
  console.log("Members trong MemberListContent:", members); // Kiểm tra dữ liệu truyền vào

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
      {/* Danh sách thành viên từ API */}
      {members && members.length > 0 ? (
        members.map((member, index) => (
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
            <Typography sx={{ ml: 1 }}>{member.userName || "Không có tên"}</Typography>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "#888", fontSize: "14px" }}>
          Không có thành viên nào.
        </Typography>
      )}
    </Box>
  );
};

export default MemberListContent;