import React, { useState } from "react";
import { Popover, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Icon Thông báo có thể click */}
      <IconButton onClick={handleOpen}>
        <NotificationsIcon
          sx={{
            marginRight: "3px",
            transform: "rotate(-30deg)",
            color: "black",
          }}
        />
      </IconButton>

      {/* Popup thông báo */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ boxShadow: 3, borderRadius: "0" }}
      >
        {/* Nội dung thông báo */}
        <div style={{ width: "341px", marginBottom: "15px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f5f5f5",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />
            <div style={{ flex: 1, fontSize: "10px" }}>
              <strong>Nguyễn Long Vũ</strong>: đã trả lời bình luận của bạn
            </div>
            <IconButton>
              <DeleteIcon color="error" fontSize="20px" />
            </IconButton>
          </div>
        </div>
      </Popover>
    </div>
  );
}
