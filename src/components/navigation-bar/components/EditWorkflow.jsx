import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

const EditWorkflow = ({ open, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sửa Workflow</DialogTitle>
      <DialogContent>
        {/* Hiển thị hoặc chỉnh sửa BPMN/workflow ở đây */}
        <Box mt={2}>
          <Typography>Thông tin hoặc trình sửa workflow...</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onSave} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkflow;
