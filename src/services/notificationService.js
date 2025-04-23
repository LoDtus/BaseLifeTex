import axiosInstance from "./apiService";

// Lấy tất cả thông báo của người dùng hiện tại
export const getAllNotificationsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/notifi`);
    return response.data;
  } catch (error) {
    console.error(
      "Không thể lấy thông báo của người dùng:",
      error.response?.data || error
    );
    throw error;
  }
};

// Lấy tất cả thông báo có phân trang (nếu bạn cần admin hoặc cho mục thống kê)
export const getAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(`/notifi`);
    return response.data;
  } catch (error) {
    console.error(
      "Không thể lấy danh sách thông báo:",
      error.response?.data || error
    );
    throw error;
  }
};

// Cập nhật trạng thái đã đọc của 1 thông báo
export const updateIsRead = async (notifiId) => {
  try {
    const response = await axiosInstance.put(`/notifi/${notifiId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Không thể cập nhật trạng thái đã đọc:",
      error.response?.data || error
    );
    throw error;
  }
};

// Xóa 1 thông báo
export const deleteNotifi = async (notifiId) => {
  try {
    const response = await axiosInstance.delete(`/notifi/${notifiId}`);
    return response.data;
  } catch (error) {
    console.error("Không thể xóa thông báo:", error.response?.data || error);
    throw error;
  }
};
// Xóa tất cả thông báo của user
export const deleteAllNotifications = async (accessToken) => {
  try {
    const response = await axiosInstance.delete("/notifi/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
