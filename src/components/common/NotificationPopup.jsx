import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Button,
  IconButton,
  Popover,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { socket } from "../../config/socket.js";
import {
  deleteAllNotifications,
  deleteNotifi,
  getAllNotificationsByUser,
  updateIsRead,
} from "../../services/notificationService";
import ConfirmDialog from "../ConfirmDialog.jsx";
import { deleteAllNotificationsSuccess } from "../../redux/notificationSlice.js";

const DISPLAY_LIMIT = 5;

export default function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedNotiId, setSelectedNotiId] = useState(null);
  const dispatch = useDispatch();

  const userId = useSelector(
    (state) => state.auth.login.currentUser?.data?.user?._id
  );

  useEffect(() => {
    if (!userId) return;

    // Lấy danh sách thông báo ban đầu
    (async () => {
      const { data } = await getAllNotificationsByUser(userId);
      setNotifications(data);
    })();

    // Cleanup khi component unmount
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Kiểm tra kết nối socket
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      if (userId) {
        socket.emit("joinRoom", userId);
        console.log("User đã tham gia phòng:", userId);
      }
    });

    // Lắng nghe sự kiện notification từ server
    socket.on("notification", (message) => {
      console.log("🔥 Nhận thông báo mới:", message);
      toast.info(`Bạn có thông báo mới: ${message}`);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  // console.log(notifications);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowAll(false);
  };

  const handleShowMore = () => setShowAll(true);

  // Sắp xếp theo thời gian giảm dần (mới nhất lên đầu)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const visibleNotifications = showAll
    ? sortedNotifications
    : sortedNotifications.slice(0, DISPLAY_LIMIT);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Đánh dấu là đã đọc khi người dùng click
  const handleMarkAsRead = async (id) => {
    const { data } = await updateIsRead(id);
    setNotifications((prev) =>
      prev.map((noti) =>
        noti._id === data._id ? { ...noti, isRead: true } : noti
      )
    );
  };
  const handleOpenConfirmDialog = (id) => {
    setSelectedNotiId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setSelectedNotiId(null);
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNotifi(selectedNotiId);
      setNotifications((prev) =>
        prev.filter((noti) => noti._id !== selectedNotiId)
      );
      toast.success("Bạn đã xoá thành công");
    } catch (error) {
      console.error("Lỗi khi xoá thông báo:", error);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const accessToken = useSelector((state) => state.auth.login.accessToken); // 👈 dùng đúng hook

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(accessToken);
      setNotifications([]); // cập nhật UI
      toast.success("Đã xóa tất cả thông báo!");
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
      toast.error(
        `Xóa thông báo thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  return (
    <div>
      {/* Icon chuông + số thông báo chưa đọc */}
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            sx={{ transform: "rotate(-30deg)", color: "black" }}
          />
        </Badge>
      </IconButton>

      {/* Popup danh sách thông báo */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div style={{ width: "341px", paddingBottom: "10px" }}>
          {/* Nút đóng */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Tổng số thông báo */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Tổng số thông báo: {notifications.length}
            </Typography>

            {notifications.length > 0 && (
              <Button
                size="small"
                color="error"
                sx={{ fontWeight: "bold" }}
                onClick={handleDeleteAll}
              >
                Xoá tất cả
              </Button>
            )}
          </Box>

          {/* Hiển thị danh sách thông báo */}
          {visibleNotifications.map((noti) => (
            <div
              key={noti._id}
              onClick={() => handleMarkAsRead(noti._id)}
              style={{
                display: "flex",
                alignItems: "center",
                background: noti.isRead ? "#f5f5f5" : "#e3f2fd",
                padding: "10px",
                margin: "8px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <img
                src={
                  noti.userId?.avatar || "https://i.pravatar.cc/40?u=default"
                }
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  border: "2px solid #fff",
                }}
              />

              <div style={{ flex: 1, fontSize: "12px" }}>
                <strong>{noti.userId?.userName}</strong>: {noti.message}
                <div style={{ fontSize: "10px", color: "gray" }}>
                  {new Date(noti.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              {/* Hiển thị icon nếu chưa đọc */}
              {!noti.isRead ? (
                <CircleIcon fontSize="8px" color="primary" />
              ) : (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirmDialog(noti._id);
                  }}
                >
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              )}
            </div>
          ))}

          {/* Nút xem thêm nếu còn thông báo */}
          {!showAll && notifications.length > DISPLAY_LIMIT && (
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <Button variant="text" size="small" onClick={handleShowMore}>
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      </Popover>
      {/* ✅ DIALOG DÙNG CHUNG */}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xoá thông báo"
        content="Bạn có chắc chắn muốn xoá thông báo này?"
      />
    </div>
  );
}
