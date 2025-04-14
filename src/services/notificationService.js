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
