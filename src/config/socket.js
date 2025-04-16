// socket.js
import { io } from "socket.io-client";

// Khởi tạo socket
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

// Gọi hàm này từ component sau khi có userId
function joinRoom(userId) {
  if (!userId) return;

  if (socket.connected) {
    socket.emit("joinRoom", userId);
    console.log("🚪 [connected] Tham gia phòng:", userId);
  } else {
    socket.on("connect", () => {
      socket.emit("joinRoom", userId);
      console.log("🚪 [connect event] Tham gia phòng:", userId);
    });
  }
}

// Nhận thông báo real-time
socket.on("notification", (msg) => {
  console.log("🔥 Notification:", msg);
  // Tuỳ bạn xử lý thêm (toast, UI, badge, ...)
});

// Khi bị ngắt kết nối
socket.on("disconnect", () => {
  console.log("❌ WebSocket disconnected");
});

export { socket, joinRoom };
