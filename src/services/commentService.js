import axiosInstance from "./apiService";

const getListCommentByTask = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `/comments/${taskId}`
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

const addCommentTask = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/comments`,
      data
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export { getListCommentByTask, addCommentTask };
