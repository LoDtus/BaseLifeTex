import axiosInstance from "./apiService";

const getListCommentByTask = async (taskId) => {
  const response = await axiosInstance.get(`/comments/${taskId}`);
  return response.data;
};

const addCommentTask = async (data) => {
  const response = await axiosInstance.post(`/comments`, data);
  return response.data;
};

export { getListCommentByTask, addCommentTask };
