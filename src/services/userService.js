import axiosInstance from "./apiService";

export const getlistUser = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/members`);
  return response.data;
};

// Hàm lấy tất cả users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`/users?page=${1}&limit=${100}`); // Endpoint để lấy tất cả users
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};
