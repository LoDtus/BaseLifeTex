import axiosInstance from "./apiService";

const getListCommentByTask = async (token, taskId) => {
  try {
    const response = await axiosInstance.get(
      `/comments/get-comments/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const addCommentTask = async (token, data) => {
  try {
    const response = await axiosInstance.post(
      `/comments/add-comment/${data.taskId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getListCommentByTask, addCommentTask };
