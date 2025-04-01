import { io } from "socket.io-client";

const host = "localhost:5000";
let socket = null;

let reconnectAttempts = 0;
const max_reconnect_attempts = 10; // Số lần tối đa để re-connect tới Socket
const reconnectDelay = 2000; // Khoảng thời gian kết nối lại, sau khi đã bị mất kết nối

let subscribedTopics = new Set(); // Mảng lưu trữ các topic đã subscribed. Làm cơ sở để kết nối lại nếu Socket bị disconnect
let unsentMessages = []; // Hàng đợi lưu trữ các message chưa được gửi thành công

export function connectToSocket(token) {
    if (!socket || socket.disconnected) {
        socket = io(host, {
            path: "/ws",
            auth: { token },

            // Tắt cơ chế tự động re-connect mặc định của SocketIO. Tránh trường hợp máy chủ bị sự cố, bảo trì nhưng
            // phía người dùng vẫn cố kết nối liên tục. Sau khi tắt, việc re-connect sẽ được thiết lập thủ công từ phía client
            reconnection: false,
        });

        socket.on("connect", () => {
            // eslint-disable-next-line no-console
            console.log("Connected to SocketIO");
            reconnectAttempts = 0; // Reset số lần kết nối lại

            // Gửi lại các message chưa được gửi trong khi bị mất kết nối tới SocketIO
            while (unsentMessages.length > 0) {
                const { topic, message } = unsentMessages.shift();
                sendMessage(topic, message);
            }
        });

        // Socket sẽ tự kết nối lại sau khoảng thời gian là 2s nếu như bị mất kết nối đột ngột
        // Đương nhiên là nếu người dùng thoát ra hoặc đóng trình duyệt thì việc kết nối hoặc kết nối lại sẽ không xảy ra
        socket.on("disconnect", (reason) => {
            // eslint-disable-next-line no-console
            console.warn(`Disconnected from SocketIO: ${reason}`);
            if (reconnectAttempts < max_reconnect_attempts) {
                setTimeout(() => {
                    reconnectAttempts++;
                    // eslint-disable-next-line no-console
                    console.log(
                        `Attempting to reconnect... (${reconnectAttempts}/${max_reconnect_attempts})`
                    );
                    connectToSocket(token); // Kết nối lại tới Socket
                }, reconnectDelay);
            } else {
                // eslint-disable-next-line no-console
                console.error("Cannot reconnect to SocketIO");
            }
        });

        socket.on("connect_error", (error) => {
            // eslint-disable-next-line no-console
            console.error("Connection error:", error);
        });
    }
}

export function disconnectFromSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
        // eslint-disable-next-line no-console
        console.log("Socket disconnected");
    }
}

export function subscribeToTopic(topic, callback) {
    if (socket) {
        socket.on(topic, callback);
        subscribedTopics.add(topic);

        // eslint-disable-next-line no-console
        console.log(`Subscribed to topic: ${topic}`);
    } else {
        // eslint-disable-next-line no-console
        console.warn("SocketIO is not connected");
    }
}

export function unsubscribeFromTopic(topic) {
    if (socket) {
        socket.off(topic);
        subscribedTopics.delete(topic);

        // eslint-disable-next-line no-console
        console.log(`Unsubscribed from topic: ${topic}`);
    } else {
        // eslint-disable-next-line no-console
        console.warn("SocketIO is not connected");
    }
}

export function sendMessage(topic, message) {
    if (socket) {
        socket.emit(topic, message);
    } else {
        // eslint-disable-next-line no-console
        console.warn("SocketIO is not connected");
        unsentMessages.push({ topic, message });
    }
}
