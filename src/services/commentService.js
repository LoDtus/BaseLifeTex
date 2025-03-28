import axiosInstance from "./apiService";

export const getListCommentByTask = async (taskId) => {
  const response = await axiosInstance.get(`/comments/${taskId}`);
  return response.data;
};

export const getPaginateCommentByTask = async (taskId, page, limit) => {
  const response = await axiosInstance.get(`/comments/${taskId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const addCommentTask = async (data) => {
  const response = await axiosInstance.post(`/comments`, data);
  return response.data;
};

