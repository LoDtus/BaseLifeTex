import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import img from "../../../../../public/imgs/basic-user.png"

const MemberListContent = ({ onClose, members }) => {
  return (
    <Box
      sx={{
        width: "343px",
        position: "relative",
        paddingLeft: "14px",
        paddingBottom: "30px",
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
        <Box sx={{ position: "absolute", right: "7px", top: "15px" }}>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          sx={{
            marginTop: "20px",
            color: "#485F7E",
            fontSize: "18px",
            marginBottom: "10px",
          }}
          fontWeight="bold"
        >
          Danh sách thành viên công việc
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          marginTop: "2px",
          paddingRight: "4px",
        }}
      >
        {members && members.length > 0 ? (
          members.map((member, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1,
                "&:hover": { bgcolor: "#f5f5f5", borderRadius: 1 },
                marginTop: "15px",
              }}
            >
              <Avatar
                src={member?.avatar || img }
              />
              <Typography sx={{ ml: 1 }}>
                {member.userName || "Không có tên"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "#888", fontSize: "14px" }}>
            Không có thành viên nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MemberListContent;
