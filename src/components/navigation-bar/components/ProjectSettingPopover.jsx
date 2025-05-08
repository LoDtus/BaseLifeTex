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
          <Typography variant="h6">Tuỳ chọn</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        
      </DialogContent>
    </Dialog>
  );
};


export default ProjectSettingPopover;
