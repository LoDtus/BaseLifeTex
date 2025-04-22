import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  description,
  actions = [],
  onClose,
  onSelect,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        {actions.map((action) => (
          <Button
            key={action.value}
            onClick={() => onSelect(action.value)}
            color="primary"
            variant="contained"
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
