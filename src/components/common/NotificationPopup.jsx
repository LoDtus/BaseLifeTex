import React, { useCallback, useEffect, useState } from "react";
import { Popover, IconButton, Typography, Badge, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";
import { getAllNotificationsByUser } from "../../services/notificationService";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const DISPLAY_LIMIT = 5;

export default function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userId = useSelector(
    (state) => state.auth.login.currentUser?.data?.user?._id
  );

  const handleNotification = useCallback((message) => {
    console.log("Nhận thông báo mới:", message);
    setNotifications((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!userId) return;
    socket.on("connect", () => {
      console.log("Đã kết nối WebSocket:", socket.id);
      // Tham gia phòng với userId
      socket.emit("joinRoom", userId);
    });
    socket.on("notification", handleNotification);

    (async () => {
      const { data } = await getAllNotificationsByUser(userId);
      setNotifications(data);
    })();
  }, [userId, handleNotification]);
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
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
            }
          : n
      )
    );
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
          <Typography variant="subtitle2" sx={{ px: 2, fontWeight: "bold" }}>
            Tổng số thông báo: {notifications.length}
          </Typography>

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
                <IconButton size="small">
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
    </div>
  );
}
