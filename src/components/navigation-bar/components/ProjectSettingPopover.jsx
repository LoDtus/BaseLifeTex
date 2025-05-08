import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const ProjectSettingPopover = ({
  open,
  onClose,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 300,
          maxWidth: 400,
          boxShadow: 10,
        },
      }}
    >
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Tuỳ chọn dự án</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <OptionItem
          icon={<InfoOutlinedIcon />}
          text="Xem chi tiết"
          onClick={() => {
            onClose();
            onViewDetail();
          }}
        />

        <OptionItem
          icon={<EditOutlinedIcon />}
          text="Chỉnh sửa"
          onClick={() => {
            onClose();
            onEdit();
          }}
        />

        <OptionItem
          icon={<DeleteOutlineOutlinedIcon />}
          text="Xoá"
          color="red"
          onClick={() => {
            onClose();
            onDelete();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const OptionItem = ({ icon, text, onClick, color }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      p: 1,
      borderRadius: 2,
      cursor: "pointer",
      color: color || "inherit",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    }}
  >
    {icon}
    <Typography variant="body1">{text}</Typography>
  </Box>
);

export default ProjectSettingPopover;
