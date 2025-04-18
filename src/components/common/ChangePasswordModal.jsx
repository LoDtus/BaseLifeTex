import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/services/authService";
import { toast } from "react-toastify";
import {
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFail,
} from "@/redux/authSlice";

const ChangePasswordButton = () => {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.data?.accessToken
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }

    dispatch(changePasswordStart());
    setLoading(true);

    try {
      await changePassword(
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        accessToken
      );
      dispatch(changePasswordSuccess());
      toast.success("Đổi mật khẩu thành công!");
      handleClose();
    } catch (error) {
      dispatch(changePasswordFail());
      console.error("Error changing password:", error);
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
        startIcon={<LockResetIcon />}
        sx={{ mt: 1 }}
      >
        Đổi mật khẩu
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu hiện tại"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Xác nhận mật khẩu mới"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangePasswordButton;
